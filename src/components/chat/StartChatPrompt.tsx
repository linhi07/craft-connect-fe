interface StartChatPromptProps {
    villageName: string
    villageAvatar?: string
    onStartChat: () => void
}

export default function StartChatPrompt({ villageName, villageAvatar, onStartChat }: StartChatPromptProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
            {/* Village avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 flex items-center justify-center mb-4 shadow-md">
                {villageAvatar ? (
                    <img src={villageAvatar} alt={villageName} className="w-full h-full rounded-full object-cover" />
                ) : (
                    <span className="text-3xl">🏘️</span>
                )}
            </div>

            {/* Village name */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {villageName}
            </h3>

            {/* Message */}
            <p className="text-gray-600 mb-2 max-w-md">
                Start a chat with {villageName} to Connect. We use
            </p>
            <p className="text-gray-600 mb-2 max-w-md">
                information from this chat to improve your experience.
            </p>

            {/* Privacy link */}
            <a
                href="#"
                className="text-gray-700 underline hover:text-gray-900 mb-8 font-medium"
            >
                Learn more about business chats and your privacy.
            </a>

            {/* Start button */}
            <button
                onClick={onStartChat}
                className="px-8 py-3 bg-red-700 hover:bg-red-800 text-white rounded-full font-semibold transition-colors shadow-lg"
            >
                Start Now
            </button>
        </div>
    )
}
