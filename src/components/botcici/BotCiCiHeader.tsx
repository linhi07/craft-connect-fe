// BotCiCi Dialog Header
import { X, Minimize2, Maximize2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBotCiCi } from '@/context/BotCiCiContext'

interface BotCiCiHeaderProps {
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  showMaximize?: boolean
  showMinimize?: boolean
}

export default function BotCiCiHeader({
  onClose,
  onMinimize,
  onMaximize,
  showMaximize = true,
  showMinimize = true,
}: BotCiCiHeaderProps) {
  const { clearChat, isConnected } = useBotCiCi()

  const handleClearChat = () => {
    if (confirm('Are you sure you want to start a new conversation? This will clear all messages.')) {
      clearChat()
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#B91C1C]">
      {/* Left: Robot Icon + Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">BotCiCi</h2>
          <span className="text-white text-xl">✨</span>
        </div>
      </div>

      {/* Right: Minimize Button */}
      <div className="flex items-center gap-1">
        {/* Minimize */}
        {showMinimize && onMinimize && (
          <button
            onClick={onMinimize}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            title="Minimize"
          >
            <div className="w-4 h-0.5 bg-white rounded-full" />
          </button>
        )}

        {/* Maximize - hidden in compact mode, shown in full page */}
        {showMaximize && onMaximize && (
          <button
            onClick={onMaximize}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors ml-1"
            title="Expand"
          >
            <Maximize2 className="h-4 w-4 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
