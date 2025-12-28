import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Bell, BellOff, Search, Pin, Image, File, Link, ChevronDown, ChevronUp, Download } from 'lucide-react'
import type { ChatRoom, ChatMessage } from '@/lib/chat-types'
import type { ConnectionEligibility } from '@/lib/connection-types'
import { connectionApi } from '@/lib/connection-api'
import ConnectionDialog from './ConnectionDialog'

interface ChatInfoSidebarProps {
    room: ChatRoom
    /** All messages in the current chat */
    messages?: ChatMessage[]
    /** Pass the current message count to trigger eligibility refresh when messages are sent */
    messageCount?: number
    /** Callback when a connection request is sent */
    onConnectionRequestSent?: () => void
}

const ELIGIBILITY_DEBOUNCE_MS = 500 // Debounce to prevent flash on rapid messages

export default function ChatInfoSidebar({ room, messages = [], messageCount, onConnectionRequestSent }: ChatInfoSidebarProps) {
    const navigate = useNavigate()

    // Connection state
    const [eligibility, setEligibility] = useState<ConnectionEligibility | null>(null)
    const [loadingEligibility, setLoadingEligibility] = useState(true)
    const [sendingRequest, setSendingRequest] = useState(false)
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)

    // Expandable sections
    const [showChatInfo, setShowChatInfo] = useState(true)
    const [showMedia, setShowMedia] = useState(false)

    // Connection dialog state
    const [showConnectionDialog, setShowConnectionDialog] = useState(false)
    const [dialogStep, setDialogStep] = useState<'confirm' | 'request-sent' | 'connected'>('confirm')

    // Extract media files (images, videos) and documents from messages
    const mediaFiles = messages.filter(m => m.messageType === 'IMAGE' && m.fileUrl)
    const documentFiles = messages.filter(m => m.messageType === 'FILE' && m.fileUrl)
    // Extract URLs from text messages for link section
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const links = messages
        .filter(m => m.messageType === 'TEXT')
        .flatMap(m => m.content.match(urlRegex) || [])
        .filter((url, index, self) => self.indexOf(url) === index) // unique only

    // Track if we've done the initial load (to avoid showing loading on refreshes)
    const hasInitialLoadRef = useRef(false)
    const prevRoomIdRef = useRef<string | null>(null)
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Check connection eligibility when room changes or message count changes (debounced)
    useEffect(() => {
        // Detect if room changed - reset initial load flag
        if (prevRoomIdRef.current !== room.roomId) {
            hasInitialLoadRef.current = false
            prevRoomIdRef.current = room.roomId
        }

        const fetchEligibility = async (showLoading: boolean) => {
            try {
                if (showLoading) {
                    setLoadingEligibility(true)
                }
                const result = await connectionApi.checkEligibility(room.roomId)
                setEligibility(result)
                hasInitialLoadRef.current = true
            } catch (error) {
                console.error('Failed to check eligibility:', error)
            } finally {
                if (showLoading) {
                    setLoadingEligibility(false)
                }
            }
        }

        // Clear any pending debounce
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        // If this is the initial load for this room, fetch immediately with loading
        // Otherwise, debounce and fetch silently (no loading state)
        if (!hasInitialLoadRef.current) {
            fetchEligibility(true) // Show loading
        } else {
            // Debounced silent refresh
            debounceTimeoutRef.current = setTimeout(() => {
                fetchEligibility(false) // No loading
            }, ELIGIBILITY_DEBOUNCE_MS)
        }

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [room.roomId, messageCount])

    // Listen for connection status changes (e.g., when invitation is accepted)
    useEffect(() => {
        const handleConnectionChange = () => {
            // Silently refresh eligibility without loading state
            connectionApi.checkEligibility(room.roomId)
                .then(result => setEligibility(result))
                .catch(error => console.error('Failed to refresh eligibility:', error))
        }

        // Listen for when current user accepts a connection (show congratulations)
        const handleConnectionAcceptedByMe = ((event: CustomEvent) => {
            const { roomId } = event.detail
            // Only show dialog if this is the current room
            if (roomId === room.roomId) {
                setDialogStep('connected')
                setShowConnectionDialog(true)
            }
        }) as EventListener

        window.addEventListener('connectionStatusChanged', handleConnectionChange)
        window.addEventListener('connectionAcceptedByMe', handleConnectionAcceptedByMe)
        
        return () => {
            window.removeEventListener('connectionStatusChanged', handleConnectionChange)
            window.removeEventListener('connectionAcceptedByMe', handleConnectionAcceptedByMe)
        }
    }, [room.roomId])

    // Poll for eligibility updates when in pending state (to detect when other side accepts)
    useEffect(() => {
        // Only poll if we have a pending request
        if (!eligibility?.pendingRequest) return

        const interval = setInterval(async () => {
            try {
                const result = await connectionApi.checkEligibility(room.roomId)
                setEligibility(result)
                
                // If status changed to connected, dispatch event
                if (result.alreadyConnected && !eligibility.alreadyConnected) {
                    window.dispatchEvent(new CustomEvent('connectionStatusChanged'))
                    
                    // Show notification for requester (they sent the request, other side accepted)
                    // This happens when YOU sent the request and the VILLAGE accepted it
                    const notification = {
                        connectionId: room.roomId, // Use roomId as identifier
                        otherPartyName: room.otherParticipantName,
                        otherPartyType: room.otherParticipantType,
                        chatRoomId: room.roomId,
                        acceptedAt: new Date().toISOString()
                    }
                    window.dispatchEvent(new CustomEvent('connectionAccepted', { detail: notification }))
                    
                    // Don't show the congratulations dialog on requester's side
                    // It will show as a notification in the bell icon instead
                }
            } catch (error) {
                console.error('Failed to poll eligibility:', error)
            }
        }, 5000) // Check every 5 seconds

        return () => clearInterval(interval)
    }, [room.roomId, eligibility?.pendingRequest, eligibility?.alreadyConnected, room.otherParticipantName, room.otherParticipantType])

    // Handle connect button click - show confirmation dialog
    const handleConnect = () => {
        if (!eligibility?.eligible || sendingRequest) return
        setDialogStep('confirm')
        setShowConnectionDialog(true)
    }

    // Handle confirmed connection request
    const handleConfirmConnect = async () => {
        try {
            setSendingRequest(true)
            await connectionApi.sendRequest(room.roomId)
            // Refresh eligibility to show pending state
            const result = await connectionApi.checkEligibility(room.roomId)
            setEligibility(result)
            // Notify parent to refresh invitations
            onConnectionRequestSent?.()
            // Show success dialog
            setDialogStep('request-sent')
        } catch (error) {
            console.error('Failed to send connection request:', error)
            alert('Failed to send connection request. Please try again.')
            setShowConnectionDialog(false)
        } finally {
            setSendingRequest(false)
        }
    }

    // Handle explore more button
    const handleExploreMore = () => {
        setShowConnectionDialog(false)
        // Could navigate to explore page or close dialog
    }

    // Handle view contact info
    const handleViewContactInfo = () => {
        setShowConnectionDialog(false)
        // Navigate to profile or show contact details
        handleViewProfile()
    }

    // Navigate to other participant's profile
    const handleViewProfile = () => {
        if (room.otherParticipantType === 'VILLAGE') {
            navigate(`/village/${room.villageId}`)
        } else {
            // For designers, we don't have a profile page yet
            // Could navigate to a designer profile page in the future
            console.log('Designer profile view not implemented yet')
        }
    }

    // Get appropriate icon for other participant
    const getParticipantIcon = () => {
        return room.otherParticipantType === 'VILLAGE' ? '🏘️' : '🎨'
    }

    // Get connect button state
    const getConnectButtonState = () => {
        if (loadingEligibility) {
            return { text: 'Loading...', disabled: true, variant: 'secondary' }
        }
        if (eligibility?.alreadyConnected) {
            return { text: 'Connected ✓', disabled: true, variant: 'success' }
        }
        if (eligibility?.pendingRequest) {
            return { text: 'Request Pending', disabled: true, variant: 'secondary' }
        }
        if (eligibility?.eligible) {
            return { text: 'CONNECT', disabled: false, variant: 'primary' }
        }
        // Not eligible - show reason
        return {
            text: 'CONNECT',
            disabled: true,
            variant: 'secondary',
            tooltip: eligibility?.reason || 'Not eligible yet'
        }
    }

    const buttonState = getConnectButtonState()

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Profile section */}
            <div className="p-6 flex flex-col items-center border-b border-gray-100">
                {/* Large avatar */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-md ${room.otherParticipantType === 'VILLAGE'
                    ? 'bg-gradient-to-br from-amber-100 to-amber-300'
                    : 'bg-gradient-to-br from-purple-100 to-purple-300'
                    }`}>
                    <span className="text-3xl">{getParticipantIcon()}</span>
                </div>

                {/* Village name */}
                <h3 className="font-semibold text-gray-900 text-lg text-center">
                    {room.otherParticipantName}
                </h3>

                {/* Action buttons */}
                <div className="flex items-center gap-4 mt-4">
                    <button
                        onClick={handleViewProfile}
                        className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <span className="text-xs">Profile</span>
                    </button>

                    <button
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {notificationsEnabled ? (
                                <Bell className="w-5 h-5" />
                            ) : (
                                <BellOff className="w-5 h-5" />
                            )}
                        </div>
                        <span className="text-xs">{notificationsEnabled ? 'Mute' : 'Unmute'}</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Search className="w-5 h-5" />
                        </div>
                        <span className="text-xs">Search</span>
                    </button>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
                {/* Information about the chat */}
                <div className="border-b border-gray-100">
                    <button
                        onClick={() => setShowChatInfo(!showChatInfo)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                        <span className="font-medium text-gray-900">Information about the chat</span>
                        {showChatInfo ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </button>

                    {showChatInfo && (
                        <div className="px-4 pb-4 space-y-2">
                            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-left">
                                <Pin className="w-5 h-5 text-gray-500" />
                                <span className="text-sm text-gray-700">Pinned messages</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Media, Files, and Links */}
                <div className="border-b border-gray-100">
                    <button
                        onClick={() => setShowMedia(!showMedia)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                        <span className="font-medium text-gray-900">Media file, File and Link</span>
                        {showMedia ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </button>

                    {showMedia && (
                        <div className="px-4 pb-4 space-y-3">
                            {/* Media Files Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Image className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Media file ({mediaFiles.length})</span>
                                </div>
                                {mediaFiles.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {mediaFiles.map((msg) => (
                                            <a
                                                key={msg.messageId}
                                                href={msg.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-primary-500 transition-colors"
                                            >
                                                <img
                                                    src={msg.thumbnailUrl || msg.fileUrl}
                                                    alt={msg.fileName || 'Media'}
                                                    className="w-full h-full object-cover"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 px-2">No media files</p>
                                )}
                            </div>

                            {/* Document Files Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <File className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">File ({documentFiles.length})</span>
                                </div>
                                {documentFiles.length > 0 ? (
                                    <div className="space-y-1">
                                        {documentFiles.map((msg) => (
                                            <a
                                                key={msg.messageId}
                                                href={msg.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-left group"
                                            >
                                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                                                    <File className="w-4 h-4 text-red-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-900 truncate">{msg.fileName || 'Document'}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {msg.fileSize ? `${(msg.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'Unknown size'}
                                                    </p>
                                                </div>
                                                <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-500 flex-shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 px-2">No files</p>
                                )}
                            </div>

                            {/* Links Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Link className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Link ({links.length})</span>
                                </div>
                                {links.length > 0 ? (
                                    <div className="space-y-1">
                                        {links.map((url, index) => (
                                            <a
                                                key={index}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-2 hover:bg-gray-50 rounded-lg text-left group"
                                            >
                                                <p className="text-xs text-blue-600 group-hover:text-blue-700 truncate">{url}</p>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 px-2">No links</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Privacy section */}
                <div className="p-4">
                    <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Privacy rights and supports</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                {/* Eligibility info (if not eligible) */}
                {eligibility && !eligibility.eligible && !eligibility.alreadyConnected && !eligibility.pendingRequest && (
                    <div className="px-4 pb-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                            <p className="text-amber-800 font-medium mb-1">Connection not available yet</p>
                            <p className="text-amber-700 text-xs">{eligibility.reason}</p>
                            <div className="mt-2 text-xs text-amber-600">
                                <p>Your messages: {eligibility.requesterMessageCount}/{eligibility.requiredMessageCount}</p>
                                <p>Their messages: {eligibility.receiverMessageCount}/{eligibility.requiredMessageCount}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Connect button - fixed at bottom */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleConnect}
                    disabled={buttonState.disabled || sendingRequest}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${buttonState.variant === 'primary'
                        ? 'bg-primary hover:bg-primary-dark text-white'
                        : buttonState.variant === 'success'
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                    title={buttonState.tooltip}
                >
                    {sendingRequest ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Sending...
                        </span>
                    ) : (
                        buttonState.text
                    )}
                </button>
            </div>

            {/* Connection Dialog */}
            <ConnectionDialog
                isOpen={showConnectionDialog}
                onClose={() => setShowConnectionDialog(false)}
                step={dialogStep}
                artisanName={room.otherParticipantName}
                onConfirm={handleConfirmConnect}
                onExploreMore={handleExploreMore}
                onViewContactInfo={handleViewContactInfo}
            />
        </div>
    )
}
