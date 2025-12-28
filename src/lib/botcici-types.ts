// BotCiCi Chatbot TypeScript Types
// Types for the AI chatbot integration

// Recommendation reason explaining why village was recommended
export interface RecommendationReason {
  factor: string
  description: string
  score: number
}

// Village recommendation with scoring and actions
export interface VillageRecommendation {
  village_id: number
  village_name: string
  location: string
  match_score: number
  reasons: RecommendationReason[]
  suggested_actions: string[]
  thumbnail_url?: string
}

// Suggested follow-up question
export interface SuggestedQuestion {
  text: string
  category: 'explore' | 'compare' | 'details'
}

// Navigation hint for frontend routing
export interface NavigationHint {
  action: 'none' | 'show_recommendations' | 'show_village_detail' | 'show_comparison'
  params?: Record<string, any>
}

// Message metadata from ChatResponse
export interface MessageMetadata {
  message_type?: 'chat' | 'recommendation' | 'information' | 'comparison'
  intent?: string
  confidence?: number
  extracted_info?: Record<string, any>
  recommendations?: VillageRecommendation[]
  suggested_questions?: SuggestedQuestion[]
  navigation?: NavigationHint
}

// Message types for BotCiCi chat
export interface BotCiCiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: MessageMetadata
}

// Request to send a message to the chatbot
export interface ChatRequest {
  message: string
  session_id?: string
  user_id?: number
}

// Enhanced response from chatbot with structured data
export interface ChatResponse {
  message_type: 'chat' | 'recommendation' | 'information' | 'comparison'
  response: string
  session_id: string
  intent?: string
  confidence?: number
  extracted_info?: Record<string, any>
  recommendations?: VillageRecommendation[]
  suggested_questions?: SuggestedQuestion[]
  navigation?: NavigationHint
}

// Action request for user interactions
export interface ActionRequest {
  action_type: 'view_details' | 'compare' | 'continue_chat'
  village_ids: number[]
  session_id: string
  context?: Record<string, any>
}

// Navigation result from action
export interface NavigationResult {
  navigate_to: 'village_detail' | 'comparison_view' | 'chat_view'
  params: Record<string, any>
  open_in: 'modal' | 'new_page' | 'sidebar'
}

// Action response with navigation and data
export interface ActionResponse {
  success: boolean
  action_type: string
  navigation: NavigationResult
  data?: Record<string, any>
  message?: string
  conversation_context?: string
}

// Individual message in history
export interface ChatHistoryItem {
  role: string
  content: string
}

// Response from history endpoint
export interface ChatHistoryResponse {
  session_id: string
  messages: ChatHistoryItem[]
}

// UI Display modes
export type BotCiCiMode = 'hidden' | 'widget' | 'dialog' | 'fullpage'

// BotCiCi state interface
export interface BotCiCiState {
  mode: BotCiCiMode
  sessionId: string | null
  messages: BotCiCiMessage[]
  isLoading: boolean
  error: string | null
}

// Village data extracted from bot response (for rich display)
export interface VillageResult {
  village_id: number
  village_name: string
  location: string
  region: string
  scale?: string
  description?: string
}
