// BotCiCi Message Bubble Component
import { useMemo } from 'react'
import { User, ExternalLink } from 'lucide-react'
import type { BotCiCiMessage } from '@/lib/botcici-types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import RecommendationCard from './RecommendationCard'
import SuggestedQuestions from './SuggestedQuestions'
import { Button } from '@/components/ui/button'

interface BotCiCiMessageProps {
  message: BotCiCiMessage
  isLatest?: boolean
  onViewDetails?: (villageId: number) => void
  onCompare?: (villageIds: number[]) => void
  onChat?: (villageId: number) => void
  onQuestionSelect?: (question: string) => void
  disabled?: boolean
}

export default function BotCiCiMessageBubble({ 
  message, 
  isLatest = false,
  onViewDetails,
  onCompare,
  onChat,
  onQuestionSelect,
  disabled = false
}: BotCiCiMessageProps) {
  const isUser = message.role === 'user'
  const isBot = message.role === 'assistant'

  // Format timestamp
  const timeString = useMemo(() => {
    const date = new Date(message.timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }, [message.timestamp])

  // Extract recommendations and questions from metadata
  const hasRecommendations = isBot && message.metadata?.recommendations && message.metadata.recommendations.length > 0
  const hasSuggestedQuestions = isBot && isLatest && message.metadata?.suggested_questions && message.metadata.suggested_questions.length > 0
  
  // Extract village ID for "View Profile" button
  // Show button when: INFORMATION intent about a specific village (not showing recommendation cards)
  const villageIdFromMetadata = useMemo(() => {
    if (!isBot || !message.metadata) return null
    
    // If we're showing recommendation cards, don't show the button (cards have their own buttons)
    if (hasRecommendations) return null
    
    // For INFORMATION intent, check if extracted_info has specific village mentioned
    if (message.metadata.intent === 'INFORMATION' && message.metadata.extracted_info) {
      const extracted = message.metadata.extracted_info
      
      // Check for village_id (backend should provide this for village detail queries)
      if ('village_id' in extracted && typeof extracted.village_id === 'number') {
        return extracted.village_id as number
      }
    }
    
    return null
  }, [isBot, message.metadata, hasRecommendations])

  return (
    <div className={`flex flex-col gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200`}>
      {/* Main message bubble */}
      <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-white border-2 border-gray-200' 
            : 'bg-[#B91C1C]'
        }`}>
          {isUser ? (
            <User className="h-5 w-5 text-gray-600" />
          ) : (
            <span className="text-lg">🤖</span>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
          {/* Message Bubble */}
          <div className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
              : 'bg-gray-100 text-gray-900'
          }`}>
            {isBot ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Customize link styling
                    a: ({ node, ...props }) => (
                      <a {...props} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" />
                    ),
                    // Customize paragraph styling
                    p: ({ node, ...props }) => (
                      <p {...props} className="mb-2 last:mb-0" />
                    ),
                    // Customize list styling
                    ul: ({ node, ...props }) => (
                      <ul {...props} className="list-disc list-inside mb-2" />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol {...props} className="list-decimal list-inside mb-2" />
                    ),
                    // Customize code blocks
                    code: ({ node, inline, ...props }: any) => (
                      inline 
                        ? <code {...props} className="bg-gray-200 px-1 py-0.5 rounded text-sm" />
                        : <code {...props} className="block bg-gray-200 p-2 rounded text-sm overflow-x-auto" />
                    ),
                    // Customize strong/bold
                    strong: ({ node, ...props }) => (
                      <strong {...props} className="font-bold" />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
          </div>

          {/* "View Profile" Button - shows when village details are provided */}
          {villageIdFromMetadata && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails && onViewDetails(villageIdFromMetadata)}
              className="mt-2 text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Village Profile
            </Button>
          )}

          {/* Timestamp */}
          <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'mr-2' : 'ml-2'}`}>
            {timeString}
          </div>
        </div>
      </div>

      {/* Recommendations Grid (for bot messages only) */}
      {hasRecommendations && (
        <div className="ml-11 mr-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Other villages for you
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {message.metadata!.recommendations!.map((rec, idx) => (
              <RecommendationCard
                key={rec.village_id || idx}
                recommendation={rec}
                onViewDetails={onViewDetails || (() => {})}
                onCompare={onCompare ? (id) => onCompare([id]) : undefined}
                onChat={onChat}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}

      {/* Suggested Questions (for latest bot message only) */}
      {hasSuggestedQuestions && onQuestionSelect && (
        <div className="ml-11 mr-4">
          <SuggestedQuestions
            questions={message.metadata!.suggested_questions}
            onSelect={onQuestionSelect}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}
