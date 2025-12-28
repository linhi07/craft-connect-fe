import { Phone, Video, MoreHorizontal } from 'lucide-react'
import type { ChatRoom } from '@/lib/chat-types'

interface ChatHeaderProps {
    room: ChatRoom
}

export default function ChatHeader({ room }: ChatHeaderProps) {
    return (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <span>🏘️</span>
                </div>

                {/* Name and status */}
                <div>
                    <h3 className="font-semibold text-gray-900">{room.otherParticipantName}</h3>
                    <p className="text-xs text-green-500">Online</p>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Voice call"
                >
                    <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Video call"
                >
                    <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="More options"
                >
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    )
}
