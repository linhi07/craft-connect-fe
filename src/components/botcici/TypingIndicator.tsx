// Typing Indicator for BotCiCi

export default function TypingIndicatorBot() {
  return (
    <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Bot Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <span className="text-sm">🤖</span>
      </div>

      {/* Typing Bubble */}
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-gray-500">Thinking...</span>
        </div>
      </div>
    </div>
  )
}
