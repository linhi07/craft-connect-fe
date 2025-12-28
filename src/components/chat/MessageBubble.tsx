import type { ChatMessage } from '@/lib/chat-types'
import ImageMessageBubble from './ImageMessageBubble'
import FileMessageBubble from './FileMessageBubble'

interface MessageBubbleProps {
    message: ChatMessage
    showSender?: boolean
}

export default function MessageBubble({ message, showSender = false }: MessageBubbleProps) {
    // Route to appropriate bubble type
    if (message.messageType === 'IMAGE') {
        return <ImageMessageBubble message={message} showSender={showSender} />
    }

    if (message.messageType === 'FILE') {
        return <FileMessageBubble message={message} showSender={showSender} />
    }

    // Default text message
    const isOwn = message.isOwnMessage

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
            <div className={`max-w-[70%] ${isOwn ? 'order-1' : 'order-2'}`}>
                {/* Sender name (for received messages, when needed) */}
                {!isOwn && showSender && (
                    <p className="text-xs text-gray-500 mb-1 ml-1">{message.senderName}</p>
                )}

                {/* Message bubble */}
                <div
                    className={`px-4 py-2 rounded-2xl ${isOwn
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}
                >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
            </div>

            {/* Avatar for received messages */}
            {!isOwn && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2 order-1 self-end ${message.senderType === 'VILLAGE'
                        ? 'bg-gradient-to-br from-amber-100 to-amber-200'
                        : 'bg-gradient-to-br from-purple-100 to-purple-200'
                    }`}>
                    <span className="text-sm">{message.senderType === 'VILLAGE' ? '🏘️' : '🎨'}</span>
                </div>
            )}
        </div>
    )
}
