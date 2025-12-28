// Connection TypeScript interfaces matching backend DTOs

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

// Connection eligibility check response
export interface ConnectionEligibility {
  eligible: boolean
  reason?: string
  requesterMessageCount: number
  receiverMessageCount: number
  requiredMessageCount: number
  alreadyConnected: boolean
  pendingRequest: boolean
}

// Connection response
export interface Connection {
  connectionId: string
  chatRoomId: string
  requesterUserId: number
  requesterName: string
  requesterType: 'DESIGNER' | 'VILLAGE'
  receiverUserId: number
  receiverName: string
  receiverType: 'DESIGNER' | 'VILLAGE'
  otherPartyName: string
  otherPartyType: string
  status: ConnectionStatus
  message?: string
  createdAt: string
  updatedAt: string
  isRequester: boolean
}

// Request to send a connection
export interface SendConnectionRequest {
  roomId: string
  message?: string
}
