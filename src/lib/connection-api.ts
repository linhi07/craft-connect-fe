import api from './api'
import type {
  ConnectionEligibility,
  Connection,
  SendConnectionRequest,
} from './connection-types'

/**
 * Connection API client.
 * All endpoints require authentication.
 */
export const connectionApi = {
  /**
   * Check if user is eligible to send a connection request.
   * GET /api/connections/eligibility/{roomId}
   */
  checkEligibility: async (roomId: string): Promise<ConnectionEligibility> => {
    const response = await api.get<ConnectionEligibility>(
      `/api/connections/eligibility/${roomId}`
    )
    return response.data
  },

  /**
   * Send a connection request.
   * POST /api/connections
   */
  sendRequest: async (roomId: string, message?: string): Promise<Connection> => {
    const request: SendConnectionRequest = { roomId, message }
    const response = await api.post<Connection>('/api/connections', request)
    return response.data
  },

  /**
   * Get all accepted connections.
   * GET /api/connections
   */
  getConnections: async (): Promise<Connection[]> => {
    const response = await api.get<Connection[]>('/api/connections')
    return response.data
  },

  /**
   * Get pending connection requests received.
   * GET /api/connections/pending/received
   */
  getPendingReceived: async (): Promise<Connection[]> => {
    const response = await api.get<Connection[]>('/api/connections/pending/received')
    return response.data
  },

  /**
   * Get pending connection requests sent.
   * GET /api/connections/pending/sent
   */
  getPendingSent: async (): Promise<Connection[]> => {
    const response = await api.get<Connection[]>('/api/connections/pending/sent')
    return response.data
  },

  /**
   * Accept a connection request.
   * PUT /api/connections/{connectionId}/accept
   */
  accept: async (connectionId: string): Promise<Connection> => {
    const response = await api.put<Connection>(
      `/api/connections/${connectionId}/accept`
    )
    return response.data
  },

  /**
   * Reject a connection request.
   * PUT /api/connections/{connectionId}/reject
   */
  reject: async (connectionId: string): Promise<Connection> => {
    const response = await api.put<Connection>(
      `/api/connections/${connectionId}/reject`
    )
    return response.data
  },
}

export default connectionApi
