import type { TypingIndicator as TypingIndicatorType } from '@/lib/chat-types'

interface TypingIndicatorProps {
    typingUsers: TypingIndicatorType[]
    currentUserEmail?: string
}

/**
 * Displays a typing indicator when other users are typing.
 * Shows animated dots and the user's name.
 */
export default function TypingIndicator({ typingUsers, currentUserEmail }: TypingIndicatorProps) {
    // Filter out current user and only show others who are typing
    // Compare by userName (email) since we don't store userId in frontend
    const othersTyping = typingUsers.filter(
        (user) => user.typing && user.userName !== currentUserEmail
    )

    if (othersTyping.length === 0) {
        return null
    }

    // Build the typing message
    const names = othersTyping.map((u) => u.userName).slice(0, 2)
    let typingText = ''

    if (names.length === 1) {
        typingText = `${names[0]} is typing`
    } else if (names.length === 2) {
        typingText = `${names[0]} and ${names[1]} are typing`
    } else {
        typingText = 'Several people are typing'
    }

    return (
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
            {/* Animated dots */}
            <div className="flex gap-1">
                <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                />
                <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                />
                <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                />
            </div>
            <span>{typingText}</span>
        </div>
    )
}
