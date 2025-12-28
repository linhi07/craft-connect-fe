import { FileText, Download, Film } from 'lucide-react'
import type { ChatMessage } from '@/lib/chat-types'

interface FileMessageBubbleProps {
    message: ChatMessage
    showSender?: boolean
}

export default function FileMessageBubble({ message, showSender = false }: FileMessageBubbleProps) {
    const isOwn = message.isOwnMessage
    const isVideo = message.fileType?.startsWith('video/')
    const isPDF = message.fileType === 'application/pdf'

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const handleDownload = async () => {
        if (!message.fileUrl) return
        
        try {
            // Fetch the file
            const response = await fetch(message.fileUrl)
            const blob = await response.blob()
            
            // Create a temporary URL for the blob
            const blobUrl = window.URL.createObjectURL(blob)
            
            // Create a temporary anchor element and trigger download
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = message.fileName || 'download'
            document.body.appendChild(link)
            link.click()
            
            // Clean up
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Download failed:', error)
        }
    }

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
            <div className={`max-w-[70%] ${isOwn ? 'order-1' : 'order-2'}`}>
                {/* Sender name */}
                {!isOwn && showSender && (
                    <p className="text-xs text-gray-500 mb-1 ml-1">{message.senderName}</p>
                )}

                {/* File bubble */}
                <div
                    className={`rounded-2xl overflow-hidden ${isOwn
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}
                >
                    {/* Video preview - standalone without file info */}
                    {isVideo && message.fileUrl ? (
                        <video
                            src={message.fileUrl}
                            controls
                            className="w-full max-w-[300px] bg-black"
                            preload="metadata"
                        />
                    ) : (
                        /* File info - only for non-video files */
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                isOwn ? 'bg-white/20' : isPDF ? 'bg-red-100' : 'bg-gray-200'
                            }`}>
                                <FileText className={`w-5 h-5 ${isOwn ? 'text-white' : isPDF ? 'text-red-600' : 'text-gray-600'}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{message.fileName || 'File'}</p>
                                <p className={`text-xs ${isOwn ? 'text-white/80' : 'text-gray-500'}`}>
                                    {formatFileSize(message.fileSize)}
                                </p>
                            </div>

                            <button
                                onClick={handleDownload}
                                className={`flex-shrink-0 p-2 rounded-lg transition-colors ${isOwn
                                    ? 'hover:bg-white/20'
                                    : 'hover:bg-gray-200'
                                }`}
                                title="Download"
                            >
                                <Download className="w-4 h-4" />
                            </button>
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
    )
}
