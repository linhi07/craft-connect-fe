import { useState } from 'react'
import { X } from 'lucide-react'
import type { ChatMessage } from '@/lib/chat-types'

interface ImageMessageBubbleProps {
    message: ChatMessage
    showSender?: boolean
}

export default function ImageMessageBubble({ message, showSender = false }: ImageMessageBubbleProps) {
    const [showLightbox, setShowLightbox] = useState(false)
    const isOwn = message.isOwnMessage

    return (
        <>
            <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
                <div className={`max-w-[70%] ${isOwn ? 'order-1' : 'order-2'}`}>
                    {/* Sender name */}
                    {!isOwn && showSender && (
                        <p className="text-xs text-gray-500 mb-1 ml-1">{message.senderName}</p>
                    )}

                    {/* Image bubble */}
                    <div
                        className={`rounded-2xl overflow-hidden max-w-[300px] ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'
                            }`}
                    >
                        {/* Thumbnail */}
                        <img
                            src={message.thumbnailUrl || message.fileUrl}
                            alt={message.fileName || 'Image'}
                            className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setShowLightbox(true)}
                            loading="lazy"
                        />

                        {/* Caption (if any) */}
                        {message.content && (
                            <div
                                className={`px-4 py-2 ${isOwn ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            </div>
                        )}
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

            {/* Lightbox */}
            {showLightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                    onClick={() => setShowLightbox(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setShowLightbox(false)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={message.fileUrl}
                        alt={message.fileName || 'Image'}
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    )
}
