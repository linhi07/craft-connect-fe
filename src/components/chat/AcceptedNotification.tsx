import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AcceptedNotificationProps {
    notification: {
        connectionId: string
        otherPartyName: string
        otherPartyType: 'DESIGNER' | 'VILLAGE'
        chatRoomId: string
        acceptedAt: string
    }
    onDismiss: (connectionId: string) => void
}

export default function AcceptedNotification({ notification, onDismiss }: AcceptedNotificationProps) {
    const navigate = useNavigate()

    const handleGoToChat = () => {
        navigate(`/chat/${notification.chatRoomId}`)
        onDismiss(notification.connectionId)
    }

    return (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
                {/* Success icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                        Connection Accepted!
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                        <span className="font-medium">{notification.otherPartyName}</span> accepted your connection request.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <button
                            onClick={handleGoToChat}
                            className="text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors"
                        >
                            Go to Chat
                        </button>
                        <button
                            onClick={() => onDismiss(notification.connectionId)}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
