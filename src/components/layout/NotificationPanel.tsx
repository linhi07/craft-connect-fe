import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import ConnectionInvitation from '@/components/chat/ConnectionInvitation'
import AcceptedNotification from '@/components/chat/AcceptedNotification'
import { connectionApi } from '@/lib/connection-api'
import type { Connection } from '@/lib/connection-types'

interface NotificationPanelProps {
    isOpen: boolean
    onClose: () => void
}

interface AcceptedNotification {
    connectionId: string
    otherPartyName: string
    otherPartyType: 'DESIGNER' | 'VILLAGE'
    chatRoomId: string
    acceptedAt: string
}

/**
 * Notification panel that displays connection invitations and accepted connections.
 * Appears as a dropdown from the bell icon in the navbar.
 */
export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
    const [invitations, setInvitations] = useState<Connection[]>([])
    const [acceptedNotifications, setAcceptedNotifications] = useState<AcceptedNotification[]>([])
    const [loading, setLoading] = useState(false)

    // Load accepted notifications from localStorage
    const loadAcceptedNotifications = (): AcceptedNotification[] => {
        try {
            const stored = localStorage.getItem('acceptedConnectionNotifications')
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    }

    // Save accepted notifications to localStorage
    const saveAcceptedNotifications = (notifications: AcceptedNotification[]) => {
        try {
            localStorage.setItem('acceptedConnectionNotifications', JSON.stringify(notifications))
        } catch (error) {
            console.error('Failed to save notifications:', error)
        }
    }

    // Fetch pending invitations
    const fetchInvitations = async () => {
        try {
            setLoading(true)
            const result = await connectionApi.getPendingReceived()
            setInvitations(result)
            
            // Load accepted notifications from storage
            setAcceptedNotifications(loadAcceptedNotifications())
        } catch (error) {
            console.error('Failed to fetch invitations:', error)
        } finally {
            setLoading(false)
        }
    }

    // Fetch invitations when panel opens
    useEffect(() => {
        if (isOpen) {
            fetchInvitations()
        }
    }, [isOpen])

    // Listen for new accepted connection notifications
    useEffect(() => {
        const handleConnectionAccepted = ((event: CustomEvent) => {
            const notification = event.detail as AcceptedNotification
            setAcceptedNotifications(prev => {
                const updated = [notification, ...prev]
                saveAcceptedNotifications(updated)
                return updated
            })
        }) as EventListener

        window.addEventListener('connectionAccepted', handleConnectionAccepted)
        return () => window.removeEventListener('connectionAccepted', handleConnectionAccepted)
    }, [])

    // Accept invitation handler
    const handleAccept = async (connectionId: string) => {
        try {
            const invitation = invitations.find(inv => inv.connectionId === connectionId)
            await connectionApi.accept(connectionId)
            setInvitations(prev => prev.filter(inv => inv.connectionId !== connectionId))
            
            // Dispatch event to show congratulations dialog for the acceptor
            // This will be caught by ChatInfoSidebar if they're in the chat
            if (invitation) {
                window.dispatchEvent(new CustomEvent('connectionAcceptedByMe', { 
                    detail: { 
                        roomId: invitation.chatRoomId 
                    } 
                }))
            }
            
            // Dispatch general status change event
            window.dispatchEvent(new CustomEvent('connectionStatusChanged'))
        } catch (error) {
            console.error('Failed to accept invitation:', error)
            alert('Failed to accept invitation. Please try again.')
        }
    }

    // Dismiss accepted notification
    const handleDismissAccepted = (connectionId: string) => {
        setAcceptedNotifications(prev => {
            const updated = prev.filter(n => n.connectionId !== connectionId)
            saveAcceptedNotifications(updated)
            return updated
        })
    }

    // Ignore invitation handler
    const handleIgnore = async (connectionId: string) => {
        try {
            await connectionApi.reject(connectionId)
            setInvitations(prev => prev.filter(inv => inv.connectionId !== connectionId))
        } catch (error) {
            console.error('Failed to ignore invitation:', error)
            alert('Failed to ignore invitation. Please try again.')
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Panel with arrow */}
            <div className="absolute top-full right-0 mt-2 z-50 w-96 max-h-[600px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-visible">
                {/* Arrow pointing up to bell icon */}
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45 z-10" />
                
                {/* Header */}
                <div className="relative flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 overflow-hidden">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Notifications ({invitations.length + acceptedNotifications.length})
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[540px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : invitations.length === 0 && acceptedNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <svg className="w-16 h-16 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="text-sm font-medium">No new notifications</p>
                            <p className="text-xs mt-1">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {/* Accepted connection notifications first */}
                            {acceptedNotifications.map(notification => (
                                <AcceptedNotification
                                    key={notification.connectionId}
                                    notification={notification}
                                    onDismiss={handleDismissAccepted}
                                />
                            ))}
                            
                            {/* Then pending invitations */}
                            {invitations.map(invitation => (
                                <ConnectionInvitation
                                    key={invitation.connectionId}
                                    invitation={invitation}
                                    onAccept={handleAccept}
                                    onIgnore={handleIgnore}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {(invitations.length > 0 || acceptedNotifications.length > 0) && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={() => {/* Navigate to all notifications page */}}
                            className="text-sm text-primary hover:text-primary-dark font-medium"
                        >
                            Show all
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
