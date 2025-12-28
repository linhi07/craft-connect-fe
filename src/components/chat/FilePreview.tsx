import { X, FileText, Film } from 'lucide-react'

interface FilePreviewProps {
    file: File
    onRemove: () => void
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    const isPDF = file.type === 'application/pdf'

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className="relative bg-gray-100 rounded-lg p-3 flex items-center gap-3 mb-2">
            {/* File preview */}
            <div className="flex-shrink-0">
                {isImage && (
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded"
                        onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                )}
                {isVideo && (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Film className="w-6 h-6 text-gray-500" />
                    </div>
                )}
                {isPDF && (
                    <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-600" />
                    </div>
                )}
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>

            {/* Remove button */}
            <button
                type="button"
                onClick={onRemove}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove file"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    )
}
