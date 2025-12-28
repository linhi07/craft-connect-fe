// BotCiCi Context - State Management for Chatbot
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import type { BotCiCiState, BotCiCiMode, BotCiCiMessage, ActionRequest, ActionResponse } from '@/lib/botcici-types'
import { botciciApi } from '@/lib/botcici-api'

// Storage keys
const SESSION_STORAGE_KEY = 'botcici_session_id'
const MESSAGES_STORAGE_KEY = 'botcici_messages'

interface BotCiCiContextType extends BotCiCiState {
  setMode: (mode: BotCiCiMode) => void
  sendMessage: (content: string) => Promise<void>
  handleAction: (actionType: 'view_details' | 'compare' | 'continue_chat', villageIds: number[], context?: Record<string, any>) => Promise<ActionResponse | null>
  clearChat: () => Promise<void>
  loadHistory: () => Promise<void>
  isConnected: boolean
}

const BotCiCiContext = createContext<BotCiCiContextType | undefined>(undefined)

export function BotCiCiProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<BotCiCiState>({
    mode: 'widget',
    sessionId: null,
    messages: [],
    isLoading: false,
    error: null,
  })
  const [isConnected, setIsConnected] = useState(false)

  // Load session and messages from localStorage on mount
  useEffect(() => {
    if (isAuthenticated) {
      const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY)
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY)
      
      if (storedSessionId) {
        setState(prev => ({ ...prev, sessionId: storedSessionId }))
        
        // Load messages from localStorage or fetch from API
        if (storedMessages) {
          try {
            const parsedMessages = JSON.parse(storedMessages)
            setState(prev => ({ 
              ...prev, 
              messages: parsedMessages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }))
            }))
          } catch (e) {
            console.error('Failed to parse stored messages:', e)
          }
        } else {
          // Fetch from API if no local messages
          loadHistory(storedSessionId)
        }
      }

      // Check if BotCiCi service is available
      checkConnection()
    }
  }, [isAuthenticated])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (state.messages.length > 0) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(state.messages))
    }
  }, [state.messages])

  // Check connection to BotCiCi service
  const checkConnection = async () => {
    try {
      await botciciApi.healthCheck()
      setIsConnected(true)
    } catch (error) {
      console.error('BotCiCi service unavailable:', error)
      setIsConnected(false)
    }
  }

  // Change display mode
  const setMode = useCallback((mode: BotCiCiMode) => {
    setState(prev => ({ ...prev, mode }))
  }, [])

  // Send a message to BotCiCi
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: BotCiCiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    // Add user message immediately
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      // Get user ID if available
      const userId = user?.email ? undefined : undefined // Can be extracted from user object if needed

      // Send to API
      const response = await botciciApi.sendMessage({
        message: content.trim(),
        session_id: state.sessionId || undefined,
        user_id: userId,
      })

      // Save session ID if this is first message
      if (!state.sessionId && response.session_id) {
        setState(prev => ({ ...prev, sessionId: response.session_id }))
        localStorage.setItem(SESSION_STORAGE_KEY, response.session_id)
      }

      // Add bot response with metadata
      const botMessage: BotCiCiMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        metadata: {
          message_type: response.message_type,
          intent: response.intent,
          confidence: response.confidence,
          extracted_info: response.extracted_info,
          recommendations: response.recommendations,
          suggested_questions: response.suggested_questions,
          navigation: response.navigation,
        }
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false,
      }))
    } catch (error: any) {
      console.error('Failed to send message:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to send message. Please try again.',
      }))

      // Add error message
      const errorMessage: BotCiCiMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again or check if the chatbot service is running.',
        timestamp: new Date(),
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }))
    }
  }, [state.sessionId, user])

  // Handle user action on recommendations
  const handleAction = useCallback(async (
    actionType: 'view_details' | 'compare' | 'continue_chat',
    villageIds: number[],
    context?: Record<string, any>
  ) => {
    if (!state.sessionId) {
      console.error('No active session')
      return null
    }

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const request: ActionRequest = {
        action_type: actionType,
        village_ids: villageIds,
        session_id: state.sessionId,
        context: context || {}
      }

      const response = await botciciApi.handleAction(request)

      // Add bot's response to chat if any (for continue_chat action)
      if (response.success && response.message && actionType === 'continue_chat') {
        const botMessage: BotCiCiMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          metadata: {
            message_type: 'information',
          }
        }

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }))
      }

      setState(prev => ({ ...prev, isLoading: false }))
      return response
    } catch (error: any) {
      console.error('Failed to handle action:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to perform action.',
      }))
      return null
    }
  }, [state.sessionId])

  // Load chat history from API
  const loadHistory = useCallback(async (sessionId?: string) => {
    const targetSessionId = sessionId || state.sessionId
    if (!targetSessionId) return

    try {
      const response = await botciciApi.getHistory(targetSessionId, 50)
      
      const messages: BotCiCiMessage[] = response.messages.map((msg, index) => ({
        id: `${msg.role}-${index}`,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(),
      }))

      setState(prev => ({
        ...prev,
        messages,
      }))
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }, [state.sessionId])

  // Clear chat and start new session
  const clearChat = useCallback(async () => {
    if (state.sessionId) {
      try {
        await botciciApi.deleteHistory(state.sessionId)
      } catch (error) {
        console.error('Failed to delete history:', error)
      }
    }

    // Clear state and storage
    setState(prev => ({
      ...prev,
      sessionId: null,
      messages: [],
      error: null,
    }))
    localStorage.removeItem(SESSION_STORAGE_KEY)
    localStorage.removeItem(MESSAGES_STORAGE_KEY)
  }, [state.sessionId])

  return (
    <BotCiCiContext.Provider
      value={{
        ...state,
        setMode,
        sendMessage,
        handleAction,
        clearChat,
        loadHistory,
        isConnected,
      }}
    >
      {children}
    </BotCiCiContext.Provider>
  )
}

/**
 * Custom hook to access BotCiCi context
 */
export function useBotCiCi() {
  const context = useContext(BotCiCiContext)
  if (context === undefined) {
    throw new Error('useBotCiCi must be used within a BotCiCiProvider')
  }
  return context
}
