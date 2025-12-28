import api from './api'
import type {
  ChatRoom,
  ChatMessage,
  ChatListResponse,
  ChatMessagePage,
  StartChatRequest,
  SendMessageRequest,
  FileUploadResponse,
} from './chat-types'

/**
 * Chat API client for designer-village messaging.
 * All endpoints require authentication.
 */
export const chatApi = {
  /**
   * Get all chat rooms for the current user.
   * GET /api/chat/rooms
   */
  getRooms: async (page = 0, size = 20): Promise<ChatListResponse> => {
    const response = await api.get<ChatListResponse>('/api/chat/rooms', {
      params: { page, size },
    })
    return response.data
  },

  /**
   * Start a new chat or get existing chat room with a village.
   * POST /api/chat/rooms
   */
  startChat: async (villageId: number): Promise<ChatRoom> => {
    const request: StartChatRequest = { villageId }
    const response = await api.post<ChatRoom>('/api/chat/rooms', request)
    return response.data
  },

  /**
   * Get a specific chat room by ID.
   * GET /api/chat/rooms/{roomId}
   */
  getRoom: async (roomId: string): Promise<ChatRoom> => {
    const response = await api.get<ChatRoom>(`/api/chat/rooms/${roomId}`)
    return response.data
  },

  /**
   * Get paginated messages for a chat room.
   * GET /api/chat/rooms/{roomId}/messages
   */
  getMessages: async (
    roomId: string,
    page = 0,
    size = 50
  ): Promise<ChatMessagePage> => {
    const response = await api.get<ChatMessagePage>(
      `/api/chat/rooms/${roomId}/messages`,
      { params: { page, size } }
    )
    return response.data
  },

  /**
   * Send a message in a chat room.
   * POST /api/chat/rooms/{roomId}/messages
   */
  sendMessage: async (
    roomId: string,
    request: SendMessageRequest
  ): Promise<ChatMessage> => {
    const response = await api.post<ChatMessage>(
      `/api/chat/rooms/${roomId}/messages`,
      request
    )
    return response.data
  },

  /**
   * Upload a file for chat messages.
   * POST /api/chat/upload
   */
  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post<FileUploadResponse>(
      '/api/chat/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  /**
   * Mark all messages in a room as read.
   * PUT /api/chat/rooms/{roomId}/read
   */
  markAsRead: async (roomId: string): Promise<void> => {
    await api.put(`/api/chat/rooms/${roomId}/read`)
  },
}

export default chatApi
