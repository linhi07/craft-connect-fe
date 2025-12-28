import { X, CheckCircle, Handshake } from 'lucide-react'

interface ConnectionDialogProps {
    isOpen: boolean
    onClose: () => void
    step: 'confirm' | 'request-sent' | 'connected'
    artisanName: string
    onConfirm: () => void
    onExploreMore: () => void
    onViewContactInfo?: () => void
}

export default function ConnectionDialog({
    isOpen,
    onClose,
    step,
    artisanName,
    onConfirm,
    onExploreMore,
    onViewContactInfo
}: ConnectionDialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={step === 'confirm' ? onClose : undefined}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                {/* Close button - only show on confirm step */}
                {step === 'confirm' && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Content based on step */}
                {step === 'confirm' && (
                    <div className="flex flex-col items-center text-center">
                        {/* Question icon */}
                        <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mb-4">
                            <span className="text-white text-3xl font-bold">?</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-red-700 mb-2">
                            You will connect with this artisan,
                        </h2>
                        <p className="text-xl font-semibold text-red-700 mb-6">
                            or you want to chat more?
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border-2 border-[#2D4947] text-[#2D4947] rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-6 py-3 bg-[#2D4947] text-white rounded-lg font-medium hover:bg-[#1F3634] transition-colors"
                            >
                                Connect
                            </button>
                        </div>
                    </div>
                )}

                {step === 'request-sent' && (
                    <div className="flex flex-col items-center text-center">
                        {/* Success badge icon */}
                        <div className="mb-4">
                            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_915_6362)">
                                    <mask id="mask0_915_6362" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="14" y="4" width="62" height="65">
                                        <path d="M44.8406 5.96777L52.939 11.8754L62.9645 11.8569L66.0432 21.3968L74.1647 27.2736L71.049 36.8011L74.1647 46.3286L66.0432 52.2054L62.9645 61.7453L52.939 61.7268L44.8406 67.6344L36.7423 61.7268L26.7168 61.7453L23.6381 52.2054L15.5166 46.3286L18.6323 36.8011L15.5166 27.2736L23.6381 21.3968L26.7168 11.8569L36.7423 11.8754L44.8406 5.96777Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M34.0488 36.8011L41.7572 44.5094L57.1738 29.0928" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </mask>
                                    <g mask="url(#mask0_915_6362)">
                                        <path d="M7.84082 -0.199219H81.8408V73.8008H7.84082V-0.199219Z" fill="#AB2624"/>
                                    </g>
                                </g>
                                <defs>
                                    <clipPath id="clip0_915_6362">
                                        <rect width="74" height="74" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-semibold text-red-700 mb-2">
                            Great, your connection request
                        </h2>
                        <h2 className="text-2xl font-semibold text-red-700 mb-3">
                            has been sent
                        </h2>

                        {/* Subtitle */}
                        <p className="text-gray-500 italic mb-6">
                            Please waiting for a response from this artisan
                        </p>

                        {/* Button */}
                        <button
                            onClick={onExploreMore}
                            className="w-full px-6 py-3 bg-[#2D4947] text-white rounded-lg font-medium hover:bg-[#1F3634] transition-colors"
                        >
                            Explore more
                        </button>
                    </div>
                )}

                {step === 'connected' && (
                    <div className="flex flex-col items-center text-center">
                        {/* Close button for connected state */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-gray-800 hover:bg-gray-50"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Handshake icon */}
                        <div className="w-20 h-20 bg-red-700 rounded-full flex items-center justify-center mb-4">
                            <Handshake className="w-10 h-10 text-white" strokeWidth={2} />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-semibold text-red-700 mb-3">
                            Congratulations
                        </h2>

                        {/* Subtitle */}
                        <p className="text-gray-600 italic mb-6">
                            You have connected successfully! Let's start
                        </p>
                        <p className="text-gray-600 italic mb-6 -mt-4">
                            amazing journey with your new partner now!
                        </p>

                        {/* Buttons */}
                        <div className="space-y-3 w-full">
                            <button
                                onClick={onViewContactInfo}
                                className="w-full px-6 py-3 border-2 border-[#2D4947] text-[#2D4947] rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                You already unlock contact info
                            </button>
                            <button
                                onClick={onExploreMore}
                                className="w-full px-6 py-3 bg-[#2D4947] text-white rounded-lg font-medium hover:bg-[#1F3634] transition-colors"
                            >
                                Explore more
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
