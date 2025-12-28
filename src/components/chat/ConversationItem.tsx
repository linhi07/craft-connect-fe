import type { ChatRoom } from '@/lib/chat-types'

interface ConversationItemProps {
    room: ChatRoom
    isActive: boolean
    onClick: () => void
}

// Format relative timestamp
function formatRelativeTime(dateString?: string): string {
    if (!dateString) return ''

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins} mins`
    if (diffHours < 24) return `${diffHours} hours`
    if (diffDays < 7) return `${diffDays} days`
    return date.toLocaleDateString()
}

export default function ConversationItem({ room, isActive, onClick }: ConversationItemProps) {
    const hasUnread = room.unreadCount > 0
    
    // Generate display text for last message
    const getLastMessageDisplay = () => {
        if (room.lastMessageType === 'IMAGE') {
            return room.lastMessageContent ? `📷 Image: ${room.lastMessageContent}` : '📷 Image'
        }
        if (room.lastMessageType === 'FILE') {
            return room.lastMessageContent ? `📎 File: ${room.lastMessageContent}` : '📎 File'
        }
        return room.lastMessageContent || 'No messages yet'
    }

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${isActive
                    ? 'bg-primary/10 border-l-4 border-primary'
                    : 'hover:bg-gray-50'
                }`}
        >
            {/* Avatar placeholder */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🏘️</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <h4 className={`font-medium text-gray-900 truncate ${hasUnread ? 'font-semibold' : ''}`}>
                        {room.otherParticipantName}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatRelativeTime(room.lastMessageAt)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                    <p className={`text-sm truncate ${hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {room.lastMessageSenderName && `${room.lastMessageSenderName}: `}
                        {getLastMessageDisplay()}
                    </p>

                    {hasUnread && (
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0">
                            {room.unreadCount > 9 ? '9+' : room.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    )
}
