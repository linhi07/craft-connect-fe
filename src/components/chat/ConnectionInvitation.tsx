import { useState } from 'react'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Connection } from '@/lib/connection-types'

interface ConnectionInvitationProps {
    invitation: Connection
    onAccept: (connectionId: string) => void
    onIgnore: (connectionId: string) => void
    loading?: boolean
}

/**
 * Displays a connection invitation card with accept/ignore actions.
 * Shows the person's name, type (Designer/Village), and mutual connections info.
 */
export default function ConnectionInvitation({
    invitation,
    onAccept,
    onIgnore,
    loading = false,
}: ConnectionInvitationProps) {
    const [actionLoading, setActionLoading] = useState<'accept' | 'ignore' | null>(null)

    const handleAccept = async () => {
        setActionLoading('accept')
        try {
            await onAccept(invitation.connectionId)
        } finally {
            setActionLoading(null)
        }
    }

    const handleIgnore = async () => {
        setActionLoading('ignore')
        try {
            await onIgnore(invitation.connectionId)
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-3">
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                        {invitation.otherPartyName}
                    </h4>
                    <p className="text-sm text-gray-600">
                        {invitation.otherPartyType === 'DESIGNER' ? 'Designer' : 'Craft Village'}
                    </p>
                    {invitation.message && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {invitation.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
                <Button
                    onClick={handleIgnore}
                    disabled={loading || actionLoading !== null}
                    variant="outline"
                    className="flex-1"
                >
                    {actionLoading === 'ignore' ? 'Ignoring...' : 'Ignore'}
                </Button>
                <Button
                    onClick={handleAccept}
                    disabled={loading || actionLoading !== null}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white"
                >
                    {actionLoading === 'accept' ? 'Accepting...' : 'Accept'}
                </Button>
            </div>
        </div>
    )
}
