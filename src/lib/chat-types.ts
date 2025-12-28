// Chat TypeScript interfaces matching backend DTOs

// Message types supported by the system
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE'

// Chat room (conversation) between designer and village
export interface ChatRoom {
  roomId: string
  designerId: number
  designerName: string
  villageId: number
  villageName: string
  otherParticipantName: string
  otherParticipantType: 'DESIGNER' | 'VILLAGE'
  lastMessageContent?: string
  lastMessageType?: MessageType
  lastMessageAt?: string
  lastMessageSenderName?: string
  unreadCount: number
  createdAt: string
  updatedAt: string
}

// Individual chat message
export interface ChatMessage {
  messageId: string
  roomId: string
  senderId: number
  senderName: string
  senderType: 'DESIGNER' | 'VILLAGE'
  content: string
  messageType: MessageType
  isOwnMessage: boolean
  createdAt: string
  // File metadata
  fileUrl?: string
  fileName?: string
  fileSize?: number
  fileType?: string
  thumbnailUrl?: string
}

// Paginated list of chat rooms
export interface ChatListResponse {
  rooms: ChatRoom[]
  currentPage: number
  totalPages: number
  totalElements: number
  size: number
}

// Paginated list of messages
export interface ChatMessagePage {
  content: ChatMessage[]
  totalElements: number
  totalPages: number
  size: number
  number: number // current page
  first: boolean
  last: boolean
}

// Request to start a new chat
export interface StartChatRequest {
  villageId?: number  // Designer starting chat with village
  designerId?: number // Village starting chat with designer
}

// Request to send a message
export interface SendMessageRequest {
  content: string
  messageType?: MessageType
  // File metadata (populated after upload)
  fileUrl?: string
  fileName?: string
  fileSize?: number
  fileType?: string
  thumbnailUrl?: string
}

// File upload response
export interface FileUploadResponse {
  fileUrl: string
  fileName: string
  fileSize: number
  fileType: string
  thumbnailUrl?: string
}

// Typing indicator
export interface TypingIndicator {
  roomId: string
  userId: number
  userName: string
  typing: boolean
}
