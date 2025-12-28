// BotCiCi Chatbot API Client
import axios, { type AxiosInstance } from 'axios'
import type { ChatRequest, ChatResponse, ChatHistoryResponse, ActionRequest, ActionResponse } from './botcici-types'

// BotCiCi API base URL
const BOTCICI_API_URL = import.meta.env.VITE_BOTCICI_API_URL || 'http://localhost:8000'

// Create axios instance for BotCiCi
const botciciClient: AxiosInstance = axios.create({
  baseURL: BOTCICI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for AI responses
})

// Response interceptor for error handling
botciciClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('BotCiCi API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

/**
 * BotCiCi API client for chatbot interactions
 */
export const botciciApi = {
  /**
   * Send a message to BotCiCi and get AI response
   * POST /api/chat
   */
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await botciciClient.post<ChatResponse>('/api/chat', request)
    return response.data
  },

  /**
   * Handle user action on recommendations
   * POST /api/chat/action
   */
  handleAction: async (request: ActionRequest): Promise<ActionResponse> => {
    const response = await botciciClient.post<ActionResponse>('/api/chat/action', request)
    return response.data
  },

  /**
   * Get chat history for a session
   * GET /api/chat/history/{session_id}
   */
  getHistory: async (sessionId: string, limit = 20): Promise<ChatHistoryResponse> => {
    const response = await botciciClient.get<ChatHistoryResponse>(
      `/api/chat/history/${sessionId}`,
      { params: { limit } }
    )
    return response.data
  },

  /**
   * Get recommendations from last session
   * GET /api/chat/recommendations/{session_id}
   */
  getRecommendations: async (sessionId: string): Promise<any> => {
    const response = await botciciClient.get(`/api/chat/recommendations/${sessionId}`)
    return response.data
  },

  /**
   * Delete chat history for a session (start fresh)
   * DELETE /api/chat/history/{session_id}
   */
  deleteHistory: async (sessionId: string): Promise<void> => {
    await botciciClient.delete(`/api/chat/history/${sessionId}`)
  },

  /**
   * Health check endpoint
   * GET /health
   */
  healthCheck: async (): Promise<{ status: string; service: string }> => {
    const response = await botciciClient.get('/health')
    return response.data
  },
}

export default botciciApi
