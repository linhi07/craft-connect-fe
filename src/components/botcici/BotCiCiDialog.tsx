// BotCiCi Dialog - Floating Chat Window
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBotCiCi } from '@/context/BotCiCiContext'
import BotCiCiHeader from './BotCiCiHeader'
import BotCiCiMessage from './BotCiCiMessage'
import BotCiCiInput from './BotCiCiInput'
import SuggestedQuestions from './SuggestedQuestions'
import { Loader2 } from 'lucide-react'

export default function BotCiCiDialog() {
  const navigate = useNavigate()
  const { mode, setMode, messages, sendMessage, handleAction, isLoading, error, isConnected } = useBotCiCi()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Don't render if not in dialog mode (check after all hooks)
  if (mode !== 'dialog') return null

  const handleClose = () => {
    setMode('widget')
  }

  const handleMinimize = () => {
    setMode('widget')
  }

  const handleMaximize = () => {
    navigate('/botcici')
  }

  const handleSendMessage = (content: string) => {
    sendMessage(content)
  }

  const handleViewDetails = (villageId: number) => {
    handleAction('view_details', [villageId]).then(response => {
      if (response?.success && response.navigation?.navigate_to === 'village_detail') {
        const villageIdParam = response.navigation.params?.village_id
        if (villageIdParam) {
          navigate(`/village/${villageIdParam}`)
        }
      }
    })
  }

  const handleCompare = (villageIds: number[]) => {
    handleAction('compare', villageIds).then(response => {
      if (response?.success && response.navigation?.navigate_to === 'comparison_view') {
        const compareIds = response.navigation.params?.village_ids
        if (compareIds && compareIds.length > 1) {
          navigate('/search', { 
            state: { 
              compareVillages: compareIds,
              comparisonData: response.data 
            } 
          })
        }
      }
    })
  }

  const handleContinueChat = (villageId: number) => {
    handleAction('continue_chat', [villageId])
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-xl shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300 overflow-hidden">
        {/* Header */}
        <BotCiCiHeader
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          showMaximize={true}
          showMinimize={true}
        />

        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-white"
        >
          {/* Welcome Message */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 rounded-full bg-[#B91C1C] flex items-center justify-center mb-4 shadow-lg">
                <span className="text-4xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Hi! I'm BotCiCi ✨
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                I can help you discover Vietnamese craft villages, find artisan partners, and learn about traditional crafts.
              </p>
              
              {/* Suggested Questions */}
              <div className="w-full">
                <SuggestedQuestions 
                  onSelect={handleSendMessage}
                  disabled={isLoading || !isConnected}
                />
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <BotCiCiMessage
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
              onViewDetails={handleViewDetails}
              onCompare={handleCompare}
              onChat={handleContinueChat}
              onQuestionSelect={handleSendMessage}
              disabled={isLoading}
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#B91C1C] flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div className="flex gap-2 items-center bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Connection Warning */}
          {!isConnected && messages.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              ⚠️ BotCiCi service is offline. Please check if the chatbot server is running.
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <BotCiCiInput
          onSend={handleSendMessage}
          disabled={isLoading || !isConnected}
          placeholder={isConnected ? "Type your message here ..." : "Service offline..."}
        />
      </div>
    </>
  )
}
