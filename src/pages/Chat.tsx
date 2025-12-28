import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageCircle, Wifi, WifiOff } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import ConversationList from '@/components/chat/ConversationList'
import ChatHeader from '@/components/chat/ChatHeader'
import MessageBubble from '@/components/chat/MessageBubble'
import MessageInput from '@/components/chat/MessageInput'
import ChatInfoSidebar from '@/components/chat/ChatInfoSidebar'
import TypingIndicator from '@/components/chat/TypingIndicator'
import StartChatPrompt from '@/components/chat/StartChatPrompt'
import { chatApi } from '@/lib/chat-api'
import { useWebSocket } from '@/lib/useWebSocket'
import type { ChatRoom, ChatMessage, TypingIndicator as TypingIndicatorType } from '@/lib/chat-types'

export default function Chat() {
    const { roomId } = useParams<{ roomId: string }>()
    const navigate = useNavigate()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const isNearBottomRef = useRef(true) // Track if user is near bottom
    const shouldScrollRef = useRef(true) // Whether to scroll on next message update
    const hasLoadedRoomRef = useRef<string | null>(null) // Track which room we've loaded

    // State for conversation list
    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [loadingRooms, setLoadingRooms] = useState(true)

    // Currently selected room
    const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null)

    // Messages for active room
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [sendingMessage, setSendingMessage] = useState(false)
    const [uploadingFile, setUploadingFile] = useState(false)
    const [chatStarted, setChatStarted] = useState(false) // Track if user clicked "Start Now"

    // Typing indicators
    const [typingUsers, setTypingUsers] = useState<TypingIndicatorType[]>([])

    // Get current user email from localStorage
    const getCurrentUserEmail = useCallback((): string | undefined => {
        try {
            const userStr = localStorage.getItem('user')
            if (userStr) {
                const user = JSON.parse(userStr)
                return user.email
            }
        } catch {
            // ignore parse errors
        }
        return undefined
    }, [])

    // Handle incoming WebSocket message
    const handleWebSocketMessage = useCallback((message: ChatMessage) => {
        const isActiveRoomMessage = message.roomId === roomId
        let isOwnMessage = false
        
        // Set scroll flag to scroll to bottom when message arrives
        if (isActiveRoomMessage) {
            shouldScrollRef.current = true
        }
        
        setMessages((prev) => {
            // Check if this is replacing an optimistic message (our own)
            const existingIndex = prev.findIndex(
                (m) => m.messageId === message.messageId || 
                       (m.messageId.startsWith('temp-') && m.content === message.content && m.roomId === message.roomId)
            )
            
            if (existingIndex >= 0) {
                // Replace optimistic message with real one - KEEP isOwnMessage=true
                isOwnMessage = true
                const updated = [...prev]
                updated[existingIndex] = {
                    ...message,
                    isOwnMessage: true // This is our message coming back
                }
                return updated
            }
            
            // New message from another user - set isOwnMessage=false
            return [...prev, { ...message, isOwnMessage: false }]
        })

        // Update room's last message in list only if it's different
        setRooms((prev) => {
            const roomIndex = prev.findIndex((r) => r.roomId === message.roomId)
            if (roomIndex === -1) return prev
            
            const room = prev[roomIndex]
            // Only update if the message is actually newer
            if (room.lastMessageAt && new Date(message.createdAt) <= new Date(room.lastMessageAt)) {
                return prev
            }
            
            const updated = [...prev]
            updated[roomIndex] = {
                ...room,
                lastMessageContent: message.content,
                lastMessageAt: message.createdAt,
                lastMessageSenderName: message.senderName,
                // Don't increment unread if it's our own message or if we're viewing this room
                unreadCount: (isOwnMessage || isActiveRoomMessage) ? 0 : (room.unreadCount || 0) + 1,
            }
            return updated
        })
        
        // If viewing this room and it's not our own message, mark as read
        if (isActiveRoomMessage && !isOwnMessage) {
            chatApi.markAsRead(message.roomId)
        }
    }, [roomId])

    // Handle typing indicator updates
    const handleTypingIndicator = useCallback((indicator: TypingIndicatorType) => {
        // Filter out current user's typing indicator
        const currentEmail = getCurrentUserEmail()
        if (!currentEmail) {
            return
        }

        // Compare emails case-insensitively and trimmed
        const normalizedCurrentEmail = currentEmail.trim().toLowerCase()
        const normalizedIndicatorEmail = indicator.userName?.trim().toLowerCase()

        if (normalizedIndicatorEmail === normalizedCurrentEmail) {
            return
        }

        setTypingUsers((prev) => {
            const existing = prev.findIndex((u) => u.userId === indicator.userId)
            if (existing >= 0) {
                // Update existing
                const updated = [...prev]
                updated[existing] = indicator
                // Remove if not typing anymore
                if (!indicator.typing) {
                    return updated.filter((u) => u.userId !== indicator.userId)
                }
                return updated
            } else if (indicator.typing) {
                // Add new typing user
                return [...prev, indicator]
            }
            return prev
        })

        // Auto-remove after 5 seconds (server might not send stop event)
        if (indicator.typing) {
            setTimeout(() => {
                setTypingUsers((prev) => prev.filter((u) => u.userId !== indicator.userId))
            }, 5000)
        }
    }, [getCurrentUserEmail])

    // WebSocket hook
    const { connected, sendMessage: wsSendMessage, sendTypingIndicator } = useWebSocket({
        roomId: roomId,
        onMessage: handleWebSocketMessage,
        onTyping: handleTypingIndicator,
        enabled: !!roomId,
    })

    // Scroll to bottom of messages
    const scrollToBottom = useCallback((force = false) => {
        if (force || isNearBottomRef.current) {
            const container = messagesContainerRef.current
            if (container) {
                // Scroll the container to bottom directly
                container.scrollTop = container.scrollHeight
            }
        }
    }, [])

    // Check if user is near the bottom of the chat
    const checkIfNearBottom = useCallback(() => {
        const container = messagesContainerRef.current
        if (!container) return true

        const threshold = 100 // pixels from bottom to consider "near bottom"
        const isNear = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
        isNearBottomRef.current = isNear
        return isNear
    }, [])

    // Handle scroll events to track if user is near bottom
    const handleScroll = useCallback(() => {
        checkIfNearBottom()
    }, [checkIfNearBottom])

    // Fetch conversation list on mount
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoadingRooms(true)
                const response = await chatApi.getRooms()
                setRooms(response.rooms || [])
                
                // If we have a roomId in the URL, sync activeRoom with loaded rooms
                if (roomId && response.rooms) {
                    const room = response.rooms.find((r) => r.roomId === roomId)
                    if (room) {
                        setActiveRoom(room)
                        hasLoadedRoomRef.current = roomId
                    }
                }
            } catch (error) {
                console.error('Failed to fetch chat rooms:', error)
            } finally {
                setLoadingRooms(false)
            }
        }

        fetchRooms()
    }, [])

    // Poll for new rooms/messages periodically (every 10 seconds)
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await chatApi.getRooms()
                setRooms(response.rooms || [])
                
                // Update active room if it exists in the new list
                if (activeRoom) {
                    const updatedRoom = response.rooms?.find((r) => r.roomId === activeRoom.roomId)
                    if (updatedRoom) {
                        setActiveRoom(updatedRoom)
                    }
                }
            } catch (error) {
                console.error('Failed to refresh chat rooms:', error)
            }
        }, 10000) // 10 seconds

        return () => clearInterval(interval)
    }, [activeRoom])

    // Load active room when roomId changes
    useEffect(() => {
        if (!roomId) {
            setActiveRoom(null)
            setTypingUsers([])
            return
        }

        // Only fetch if we haven't loaded this room yet
        if (hasLoadedRoomRef.current === roomId) {
            return
        }

        hasLoadedRoomRef.current = roomId
        setTypingUsers([])

        // Try to find room in existing list first
        const existingRoom = rooms.find((r) => r.roomId === roomId)
        if (existingRoom) {
            setActiveRoom(existingRoom)
            return
        }

        // If not in list and not currently loading rooms, fetch it
        if (!loadingRooms) {
            const fetchRoom = async () => {
                try {
                    const room = await chatApi.getRoom(roomId)
                    setActiveRoom(room)
                    // Add to rooms list if not present
                    setRooms((prev) => {
                        if (prev.find((r) => r.roomId === roomId)) {
                            return prev
                        }
                        return [room, ...prev]
                    })
                } catch (error) {
                    console.error('Failed to fetch room:', error)
                }
            }
            fetchRoom()
        }
    }, [roomId, loadingRooms])

    // Load messages when active room changes
    useEffect(() => {
        if (!activeRoom) {
            setMessages([])
            setChatStarted(false)
            return
        }

        const fetchMessages = async () => {
            try {
                setLoadingMessages(true)
                const response = await chatApi.getMessages(activeRoom.roomId)
                // Reverse to show oldest first (API returns newest first)
                const messagesList = (response.content || []).reverse()
                setMessages(messagesList)
                
                // If there are existing messages, consider chat as started
                if (messagesList.length > 0) {
                    setChatStarted(true)
                }
                
                // Mark as read
                await chatApi.markAsRead(activeRoom.roomId)
                
                // Reset unread count in the room list
                setRooms((prev) => {
                    const roomIndex = prev.findIndex((r) => r.roomId === activeRoom.roomId)
                    if (roomIndex === -1) return prev
                    
                    const updated = [...prev]
                    updated[roomIndex] = {
                        ...updated[roomIndex],
                        unreadCount: 0,
                    }
                    return updated
                })
            } catch (error) {
                console.error('Failed to fetch messages:', error)
            } finally {
                setLoadingMessages(false)
            }
        }

        fetchMessages()
    }, [activeRoom?.roomId])

    // Poll for new messages in active room (every 5 seconds) as a backup to WebSocket
    useEffect(() => {
        if (!activeRoom) return

        const interval = setInterval(async () => {
            try {
                const response = await chatApi.getMessages(activeRoom.roomId)
                const newMessages = (response.content || []).reverse()
                
                // Only update if we have new messages
                setMessages(prev => {
                    // Compare last message
                    if (prev.length === 0 || newMessages.length > prev.length) {
                        return newMessages
                    }
                    const lastPrevMsg = prev[prev.length - 1]
                    const lastNewMsg = newMessages[newMessages.length - 1]
                    if (lastPrevMsg.messageId !== lastNewMsg.messageId) {
                        shouldScrollRef.current = true
                        return newMessages
                    }
                    return prev
                })
            } catch (error) {
                console.error('Failed to poll messages:', error)
            }
        }, 5000) // 5 seconds

        return () => clearInterval(interval)
    }, [activeRoom?.roomId])

    // Set scroll position to bottom immediately after messages load (before paint)
    useLayoutEffect(() => {
        if (!loadingMessages && messages.length > 0) {
            const container = messagesContainerRef.current
            if (container) {
                container.scrollTop = container.scrollHeight
            }
        }
    }, [loadingMessages, messages.length])

    // Scroll to bottom when messages change (only if near bottom or explicitly requested)
    useEffect(() => {
        // Use setTimeout to ensure DOM has updated before scrolling
        const timeoutId = setTimeout(() => {
            if (shouldScrollRef.current) {
                scrollToBottom(true)
                shouldScrollRef.current = false
            } else {
                scrollToBottom(false)
            }
        }, 0)

        return () => clearTimeout(timeoutId)
    }, [messages, scrollToBottom])

    // Handle room selection
    const handleSelectRoom = (selectedRoomId: string) => {
        navigate(`/chat/${selectedRoomId}`)
    }

    // Handle sending a message
    const handleSendMessage = async (content: string, file?: File) => {
        if (!activeRoom || sendingMessage || uploadingFile) return
        if (!content.trim() && !file) return

        // Set scroll flag before any state updates
        shouldScrollRef.current = true

        let fileMetadata = undefined

        // Upload file first if present
        if (file) {
            try {
                setUploadingFile(true)
                const uploadResponse = await chatApi.uploadFile(file)
                fileMetadata = uploadResponse
            } catch (error) {
                console.error('Failed to upload file:', error)
                alert('Failed to upload file. Please try again.')
                setUploadingFile(false)
                shouldScrollRef.current = false
                return
            } finally {
                setUploadingFile(false)
            }
        }

        // Determine message type
        const messageType = fileMetadata 
            ? (fileMetadata.fileType.startsWith('image/') ? 'IMAGE' : 'FILE')
            : 'TEXT'

        // Try WebSocket first if connected
        if (connected) {
            // Optimistically add message (will be replaced when WS echo arrives)
            const optimisticMessage: ChatMessage = {
                messageId: `temp-${Date.now()}-${Math.random()}`,
                roomId: activeRoom.roomId,
                senderId: 0, // Will be set by server
                senderName: 'You',
                senderType: 'DESIGNER',
                content: content || '',
                messageType,
                isOwnMessage: true,
                createdAt: new Date().toISOString(),
                ...(fileMetadata && {
                    fileUrl: fileMetadata.fileUrl,
                    fileName: fileMetadata.fileName,
                    fileSize: fileMetadata.fileSize,
                    fileType: fileMetadata.fileType,
                    thumbnailUrl: fileMetadata.thumbnailUrl,
                }),
            }
            
            setMessages((prev) => [...prev, optimisticMessage])
            
            // Send via WebSocket after state update
            wsSendMessage(content || '', fileMetadata)

            // Update room's last message
            setRooms((prev) => {
                const roomIndex = prev.findIndex((r) => r.roomId === activeRoom.roomId)
                if (roomIndex === -1) return prev
                
                const updated = [...prev]
                updated[roomIndex] = {
                    ...updated[roomIndex],
                    lastMessageContent: content || (fileMetadata ? fileMetadata.fileName : ''),
                    lastMessageAt: optimisticMessage.createdAt,
                    lastMessageSenderName: 'You',
                }
                return updated
            })
            return
        }

        // Fallback to REST API
        try {
            setSendingMessage(true)
            const newMessage = await chatApi.sendMessage(activeRoom.roomId, {
                content: content || '',
                messageType,
                ...(fileMetadata && {
                    fileUrl: fileMetadata.fileUrl,
                    fileName: fileMetadata.fileName,
                    fileSize: fileMetadata.fileSize,
                    fileType: fileMetadata.fileType,
                    thumbnailUrl: fileMetadata.thumbnailUrl,
                }),
            })
            
            // Set scroll flag to scroll to bottom
            shouldScrollRef.current = true
            
            setMessages((prev) => [...prev, newMessage])

            // Update room's last message in list
            setRooms((prev) => {
                const roomIndex = prev.findIndex((r) => r.roomId === activeRoom.roomId)
                if (roomIndex === -1) return prev
                
                const updated = [...prev]
                updated[roomIndex] = {
                    ...updated[roomIndex],
                    lastMessageContent: content || (fileMetadata ? fileMetadata.fileName : ''),
                    lastMessageAt: newMessage.createdAt,
                    lastMessageSenderName: 'You',
                }
                return updated
            })
        } catch (error) {
            console.error('Failed to send message:', error)
            // Reset scroll flag on error
            shouldScrollRef.current = false
        } finally {
            setSendingMessage(false)
        }
    }

    // Handle typing indicator
    const handleTyping = useCallback((isTyping: boolean) => {
        sendTypingIndicator(isTyping)
    }, [sendTypingIndicator])

    // Format date for message grouping
    const formatDateDivider = (dateString: string): string => {
        // Parse the date string - handle both ISO format and other formats
        const date = new Date(dateString)
        
        // Validate date
        if (isNaN(date.getTime())) {
            return 'Today' // Fallback for invalid dates
        }
        
        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        // Compare dates at midnight local time
        const dateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const yesterdayAtMidnight = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

        if (dateAtMidnight.getTime() === todayAtMidnight.getTime()) {
            return 'Today'
        } else if (dateAtMidnight.getTime() === yesterdayAtMidnight.getTime()) {
            return 'Yesterday'
        } else {
            return date.toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            })
        }
    }

    // Group messages by date
    const getDateFromMessage = (msg: ChatMessage): string => {
        const date = new Date(msg.createdAt)
        // Return date key in local timezone (YYYY-MM-DD format)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    // Format message time for timestamp dividers
    const formatMessageTime = (dateString: string): string => {
        const date = new Date(dateString)
        
        // Validate date, fallback to current time if invalid
        if (isNaN(date.getTime())) {
            return new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            })
        }
        
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        })
    }

    // Check if messages should be grouped (within 5 minutes of each other)
    const shouldGroupWithPrevious = (currentMsg: ChatMessage, previousMsg: ChatMessage | null): boolean => {
        if (!previousMsg) return false
        
        // Must be from same sender
        if (currentMsg.senderId !== previousMsg.senderId) return false
        
        // Must be same date
        if (getDateFromMessage(currentMsg) !== getDateFromMessage(previousMsg)) return false
        
        // Must be within 5 minutes
        const currentTime = new Date(currentMsg.createdAt).getTime()
        const previousTime = new Date(previousMsg.createdAt).getTime()
        const timeDiffMinutes = (currentTime - previousTime) / (1000 * 60)
        
        return timeDiffMinutes <= 5
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Conversation List */}
                <div className="w-80 flex-shrink-0 h-full">
                    <ConversationList
                        rooms={rooms}
                        activeRoomId={roomId}
                        onSelectRoom={handleSelectRoom}
                        loading={loadingRooms}
                    />
                </div>

                {/* Center Panel - Messages */}
                <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
                    {activeRoom ? (
                        <>
                            {/* Header with connection status */}
                            <div className="relative">
                                <ChatHeader room={activeRoom} />
                                {/* WebSocket connection indicator */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    {connected ? (
                                        <span className="flex items-center gap-1 text-xs text-green-600">
                                            <Wifi className="w-3 h-3" />
                                            Live
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs text-gray-400">
                                            <WifiOff className="w-3 h-3" />
                                            Offline
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Messages area */}
                            <div
                                ref={messagesContainerRef}
                                onScroll={handleScroll}
                                className="flex-1 overflow-y-auto p-4"
                            >
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : messages.length === 0 && !chatStarted ? (
                                    <StartChatPrompt
                                        villageName={activeRoom.otherParticipantName}
                                        onStartChat={() => setChatStarted(true)}
                                    />
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                                        <p>No messages yet</p>
                                        <p className="text-sm">Start the conversation!</p>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((message, index) => {
                                            const previousMessage = index > 0 ? messages[index - 1] : null
                                            
                                            // Check if we need a date divider
                                            const showDateDivider =
                                                index === 0 ||
                                                getDateFromMessage(messages[index - 1]) !== getDateFromMessage(message)

                                            // Check if this message should be grouped with previous
                                            const isGrouped = shouldGroupWithPrevious(message, previousMessage)
                                            
                                            // Show timestamp divider if not grouped with previous message
                                            const showTimestamp = !isGrouped

                                            return (
                                                <div key={message.messageId}>
                                                    {showDateDivider && (
                                                        <div className="flex items-center justify-center my-4">
                                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                                                                {formatDateDivider(message.createdAt)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {showTimestamp && !showDateDivider && (
                                                        <div className="flex items-center justify-center my-3">
                                                            <span className="text-xs text-gray-400">
                                                                {formatMessageTime(message.createdAt)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <MessageBubble message={message} />
                                                </div>
                                            )
                                        })}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Typing indicator */}
                            <TypingIndicator
                                typingUsers={typingUsers}
                                currentUserEmail={getCurrentUserEmail()}
                            />

                            {/* Input - only show if chat started or has messages */}
                            {(chatStarted || messages.length > 0) && (
                                <MessageInput
                                    onSend={handleSendMessage}
                                    onTyping={handleTyping}
                                    disabled={sendingMessage}
                                    uploading={uploadingFile}
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg">Select a conversation</p>
                            <p className="text-sm">Choose a village to start chatting</p>
                        </div>
                    )}
                </div>

                {/* Right Panel - Info sidebar */}
                <div className="w-72 flex-shrink-0 h-full overflow-y-auto">
                    {activeRoom && (
                        <ChatInfoSidebar 
                            room={activeRoom}
                            messages={messages}
                            messageCount={messages.length}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

