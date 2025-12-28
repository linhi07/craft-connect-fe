// BotCiCi Full Page Mode
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Minimize2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { useBotCiCi } from '@/context/BotCiCiContext'
import BotCiCiMessage from '@/components/botcici/BotCiCiMessage'
import BotCiCiInput from '@/components/botcici/BotCiCiInput'
import SuggestedQuestions from '@/components/botcici/SuggestedQuestions'
import { Loader2, RotateCcw } from 'lucide-react'

export default function BotCiCi() {
  const navigate = useNavigate()
  const { 
    setMode, 
    messages, 
    sendMessage,
    handleAction,
    clearChat,
    isLoading, 
    error,
    isConnected 
  } = useBotCiCi()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Set mode to fullpage on mount
  useEffect(() => {
    setMode('fullpage')
    return () => {
      // Reset to widget mode when leaving page
      setMode('widget')
    }
  }, [setMode])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleBack = () => {
    setMode('widget')
    navigate('/')
  }

  const handleMinimize = () => {
    setMode('dialog')
    navigate('/')
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

  const handleClearChat = () => {
    if (confirm('Are you sure you want to start a new conversation? This will clear all messages.')) {
      clearChat()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Chat with BotCiCi</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {isConnected ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleClearChat}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              New Chat
            </Button>
            
            <Button
              onClick={handleMinimize}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Minimize2 className="h-4 w-4" />
              Minimize
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="max-w-3xl mx-auto">
            {/* Welcome Message */}
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                  <span className="text-5xl">🤖</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Hi! I'm BotCiCi
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                  I'm your AI assistant for discovering Vietnamese craft villages. 
                  I can help you find artisan partners, learn about traditional crafts, 
                  and explore the rich cultural heritage of Vietnam.
                </p>
                
                {/* Suggested Questions */}
                <div className="w-full max-w-2xl">
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
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="flex gap-2 items-center bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 mb-4">
                {error}
              </div>
            )}

            {/* Connection Warning */}
            {!isConnected && messages.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-4">
                ⚠️ BotCiCi service is offline. Please check if the chatbot server is running.
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-6 sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <BotCiCiInput
              onSend={handleSendMessage}
              disabled={isLoading || !isConnected}
              placeholder={isConnected ? "Ask me anything about craft villages..." : "Service offline..."}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
