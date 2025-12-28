import { useRef, ReactNode } from 'react'
import { Paperclip, Loader2 } from 'lucide-react'

interface FileUploadButtonProps {
    onFileSelect: (file: File) => void
    disabled?: boolean
    loading?: boolean
    accept?: string
    icon?: ReactNode
}

const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'video/mp4',
    'video/quicktime'  // MOV files
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function FileUploadButton({ 
    onFileSelect, 
    disabled = false, 
    loading = false,
    accept,
    icon 
}: FileUploadButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if (!disabled && !loading) {
            fileInputRef.current?.click()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type only if no custom accept prop is provided
        if (!accept && !ALLOWED_FILE_TYPES.includes(file.type)) {
            alert(`File type not supported. Allowed types: JPG, PNG, PDF, MP4, MOV`)
            return
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            alert(`File size exceeds 10MB limit`)
            return
        }

        onFileSelect(file)
        
        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept || ALLOWED_FILE_TYPES.join(',')}
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                type="button"
                onClick={handleClick}
                disabled={disabled || loading}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Attach file"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" strokeWidth={2} />
                ) : icon ? (
                    icon
                ) : (
                    <Paperclip className="w-6 h-6" strokeWidth={2} />
                )}
            </button>
        </>
    )
}
