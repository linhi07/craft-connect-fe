import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Smile, Heart, Plus, Image, FileText } from 'lucide-react'
import FileUploadButton from './FileUploadButton'
import FilePreview from './FilePreview'

interface MessageInputProps {
    onSend: (content: string, file?: File) => void
    onTyping?: (isTyping: boolean) => void
    disabled?: boolean
    uploading?: boolean
}

const TYPING_DEBOUNCE_MS = 2000 // Stop typing indicator after 2s of no input

export default function MessageInput({ onSend, onTyping, disabled = false, uploading = false }: MessageInputProps) {
    const [message, setMessage] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isTypingRef = useRef(false)

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }, [message])

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [])

    // Handle typing indicator with debounce
    const handleTyping = useCallback(() => {
        if (!onTyping) return

        // Send typing:true if not already typing
        if (!isTypingRef.current) {
            isTypingRef.current = true
            onTyping(true)
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Set new timeout to send typing:false
        typingTimeoutRef.current = setTimeout(() => {
            if (isTypingRef.current) {
                isTypingRef.current = false
                onTyping(false)
            }
        }, TYPING_DEBOUNCE_MS)
    }, [onTyping])

    // Stop typing indicator immediately
    const stopTyping = useCallback(() => {
        if (!onTyping) return

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        if (isTypingRef.current) {
            isTypingRef.current = false
            onTyping(false)
        }
    }, [onTyping])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
        handleTyping()
    }

    const handleSubmit = () => {
        const trimmed = message.trim()
        // Allow sending if there's text OR a file
        if ((trimmed || selectedFile) && !disabled && !uploading) {
            stopTyping() // Stop typing indicator when sending
            onSend(trimmed, selectedFile || undefined)
            setMessage('')
            setSelectedFile(null)
        }
    }

    const handleFileSelect = (file: File) => {
        setSelectedFile(file)
    }

    const handleFileRemove = () => {
        setSelectedFile(null)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleBlur = () => {
        stopTyping() // Stop typing indicator on blur
    }

    return (
        <div className="border-t border-gray-200 bg-white">
            {/* File preview */}
            {selectedFile && (
                <div className="p-3 border-b border-gray-200">
                    <FilePreview file={selectedFile} onRemove={handleFileRemove} />
                </div>
            )}

            {/* Input bar */}
            <div className="flex items-center gap-2 p-3">
                {/* Plus button */}
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
                    title="More options"
                    disabled={disabled || uploading}
                >
                    <Plus className="w-6 h-6" strokeWidth={2} />
                </button>

                {/* Image/Video upload button */}
                <FileUploadButton 
                    onFileSelect={handleFileSelect} 
                    disabled={disabled || uploading}
                    loading={uploading}
                    accept="image/*,video/mp4,video/quicktime,.mp4,.mov"
                    icon={<Image className="w-6 h-6" strokeWidth={2} />}
                />

                {/* File upload button */}
                <FileUploadButton 
                    onFileSelect={handleFileSelect} 
                    disabled={disabled || uploading}
                    loading={uploading}
                    accept=".pdf,.doc,.docx"
                    icon={<FileText className="w-6 h-6" strokeWidth={2} />}
                />

                {/* Text input area */}
                <div className="flex-1 flex items-center bg-gray-100 rounded-3xl px-4 py-2.5">
                    <span className="text-gray-400 text-sm font-medium mr-2">Aa</span>
                    <input
                        ref={textareaRef as any}
                        type="text"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value)
                            handleTyping()
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSubmit()
                            }
                        }}
                        onBlur={handleBlur}
                        placeholder={selectedFile ? "Add a caption..." : ""}
                        disabled={disabled || uploading}
                        className="flex-1 bg-transparent outline-none text-sm"
                    />
                </div>

                {/* Emoji button */}
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
                    title="Emoji"
                    disabled={disabled || uploading}
                >
                    <Smile className="w-6 h-6" strokeWidth={2} />
                </button>

                {/* Send or Heart button */}
                {(message.trim() || selectedFile) ? (
                    <button
                        onClick={handleSubmit}
                        disabled={disabled || uploading}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-primary disabled:opacity-50"
                        title="Send message"
                    >
                        <Send className="w-6 h-6" strokeWidth={2} />
                    </button>
                ) : (
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
                        title="Send like"
                        disabled={disabled || uploading}
                    >
                        <Heart className="w-6 h-6" strokeWidth={2} />
                    </button>
                )}
            </div>
        </div>
    )
}

