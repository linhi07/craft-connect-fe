// BotCiCi Widget - Floating Button
import { MessageCircle, Sparkles } from 'lucide-react'
import { useBotCiCi } from '@/context/BotCiCiContext'
import { Button } from '@/components/ui/button'

export default function BotCiCiWidget() {
  const { mode, setMode, isConnected } = useBotCiCi()

  const unreadCount = 0 // Can implement unread logic if needed

  // Don't show widget if in fullpage mode or hidden (check after hooks)
  if (mode === 'fullpage' || mode === 'hidden') return null

  // If dialog is open, don't show widget
  if (mode === 'dialog') return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-8 duration-300">
      {/* Widget Button */}
      <Button
        onClick={() => setMode('dialog')}
        className="h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 relative group"
        size="icon"
        title="Chat with BotCiCi"
      >
        <MessageCircle className="h-8 w-8 text-white" />
        
        {/* Connection indicator */}
        <div className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          isConnected ? 'bg-green-500' : 'bg-gray-400'
        }`} />
      </Button>

      {/* Label Badge */}
      <div className="absolute -top-2 -left-12 bg-primary text-white text-xs px-3 py-1 rounded-full shadow-md whitespace-nowrap flex items-center gap-1 pointer-events-none">
        <Sparkles className="h-3 w-3" />
        <span className="font-medium">BotCiCi</span>
      </div>

      {/* Unread Badge (if needed) */}
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </div>
  )
}
