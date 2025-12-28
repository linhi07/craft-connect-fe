import { useEffect, useRef, useCallback, useState } from 'react'
import { Client, type IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { ChatMessage, TypingIndicator, FileUploadResponse } from './chat-types'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws/chat'

interface UseWebSocketOptions {
  roomId: string | undefined
  onMessage: (message: ChatMessage) => void
  onTyping: (indicator: TypingIndicator) => void
  enabled?: boolean
}

interface UseWebSocketReturn {
  connected: boolean
  sendMessage: (content: string, fileMetadata?: FileUploadResponse) => void
  sendTypingIndicator: (typing: boolean) => void
}

/**
 * Custom hook for WebSocket chat connection using STOMP over SockJS.
 * Handles connection, subscriptions, and message sending.
 */
export function useWebSocket({
  roomId,
  onMessage,
  onTyping,
  enabled = true,
}: UseWebSocketOptions): UseWebSocketReturn {
  const clientRef = useRef<Client | null>(null)
  const [connected, setConnected] = useState(false)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Store callbacks in refs to avoid stale closures
  const onMessageRef = useRef(onMessage)
  const onTypingRef = useRef(onTyping)
  
  useEffect(() => {
    onMessageRef.current = onMessage
    onTypingRef.current = onTyping
  }, [onMessage, onTyping])

  // Connect and setup subscriptions
  useEffect(() => {
    if (!enabled || !roomId) {
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No auth token available for WebSocket connection')
      return
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP]', str)
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    client.onConnect = () => {
      console.log('WebSocket connected')
      setConnected(true)

      // Subscribe to messages for this room
      client.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
        try {
          const chatMessage: ChatMessage = JSON.parse(message.body)
          onMessageRef.current(chatMessage)
        } catch (e) {
          console.error('Failed to parse message:', e)
        }
      })

      // Subscribe to typing indicators for this room
      client.subscribe(`/topic/room/${roomId}/typing`, (message: IMessage) => {
        try {
          const indicator: TypingIndicator = JSON.parse(message.body)
          onTypingRef.current(indicator)
        } catch (e) {
          console.error('Failed to parse typing indicator:', e)
        }
      })
    }

    client.onDisconnect = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
    }

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message'], frame.body)
      setConnected(false)
    }

    client.activate()
    clientRef.current = client

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      client.deactivate()
      clientRef.current = null
      setConnected(false)
    }
  }, [roomId, enabled])

  // Send a chat message
  const sendMessage = useCallback(
    (content: string, fileMetadata?: FileUploadResponse) => {
      if (!clientRef.current?.connected || !roomId) {
        console.warn('Cannot send message: WebSocket not connected')
        return
      }

      // Determine message type
      const messageType = fileMetadata 
        ? (fileMetadata.fileType.startsWith('image/') ? 'IMAGE' : 'FILE')
        : 'TEXT'

      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({
          roomId,
          content,
          messageType,
          ...(fileMetadata && {
            fileUrl: fileMetadata.fileUrl,
            fileName: fileMetadata.fileName,
            fileSize: fileMetadata.fileSize,
            fileType: fileMetadata.fileType,
            thumbnailUrl: fileMetadata.thumbnailUrl,
          }),
        }),
      })
    },
    [roomId]
  )

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (typing: boolean) => {
      if (!clientRef.current?.connected || !roomId) {
        return
      }

      clientRef.current.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({
          roomId,
          typing,
        }),
      })
    },
    [roomId]
  )

  return {
    connected,
    sendMessage,
    sendTypingIndicator,
  }
}

export default useWebSocket
