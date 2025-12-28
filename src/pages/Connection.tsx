import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, Check, Clock, X, MessageCircle, Search, Loader2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { connectionApi } from '@/lib/connection-api'
import type { Connection } from '@/lib/connection-types'

type TabType = 'all' | 'pending-received' | 'pending-sent'

export default function ConnectionPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<TabType>('all')
    const [searchQuery, setSearchQuery] = useState('')
    
    // Connection data
    const [connections, setConnections] = useState<Connection[]>([])
    const [pendingReceived, setPendingReceived] = useState<Connection[]>([])
    const [pendingSent, setPendingSent] = useState<Connection[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch all connections data
    const fetchConnections = async () => {
        try {
            setLoading(true)
            const [allConnections, received, sent] = await Promise.all([
                connectionApi.getConnections(),
                connectionApi.getPendingReceived(),
                connectionApi.getPendingSent(),
            ])
            setConnections(allConnections)
            setPendingReceived(received)
            setPendingSent(sent)
        } catch (error) {
            console.error('Failed to fetch connections:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConnections()

        // Listen for connection changes
        const handleConnectionChange = () => {
            fetchConnections()
        }
        window.addEventListener('connectionStatusChanged', handleConnectionChange)
        return () => window.removeEventListener('connectionStatusChanged', handleConnectionChange)
    }, [])

    // Handle accept invitation
    const handleAccept = async (connectionId: string) => {
        try {
            await connectionApi.accept(connectionId)
            window.dispatchEvent(new CustomEvent('connectionStatusChanged'))
            fetchConnections()
        } catch (error) {
            console.error('Failed to accept invitation:', error)
            alert('Failed to accept invitation. Please try again.')
        }
    }

    // Handle reject invitation
    const handleReject = async (connectionId: string) => {
        try {
            await connectionApi.reject(connectionId)
            fetchConnections()
        } catch (error) {
            console.error('Failed to reject invitation:', error)
            alert('Failed to reject invitation. Please try again.')
        }
    }

    // Get filtered data based on active tab
    const getFilteredData = () => {
        let data: Connection[] = []
        switch (activeTab) {
            case 'all':
                data = connections
                break
            case 'pending-received':
                data = pendingReceived
                break
            case 'pending-sent':
                data = pendingSent
                break
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            data = data.filter(conn =>
                conn.otherPartyName.toLowerCase().includes(query)
            )
        }

        return data
    }

    const filteredData = getFilteredData()

    // Get counts for tabs
    const allCount = connections.length
    const receivedCount = pendingReceived.length
    const sentCount = pendingSent.length

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Connections</h1>
                    <p className="text-gray-600">
                        Manage your connections with villages and designers
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Connections</p>
                                <p className="text-3xl font-bold text-gray-900">{allCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Pending Invitations</p>
                                <p className="text-3xl font-bold text-gray-900">{receivedCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Requests Sent</p>
                                <p className="text-3xl font-bold text-gray-900">{sentCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    {/* Tabs and Search Bar */}
                    <div className="border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4">
                            {/* Tabs */}
                            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'all'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    All ({allCount})
                                </button>
                                <button
                                    onClick={() => setActiveTab('pending-received')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'pending-received'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Invitations ({receivedCount})
                                </button>
                                <button
                                    onClick={() => setActiveTab('pending-sent')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'pending-sent'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Sent ({sentCount})
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search connections..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full sm:w-64"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Connection List */}
                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <Users className="w-16 h-16 mb-4 opacity-50" />
                                <p className="text-lg font-medium">
                                    {searchQuery ? 'No connections found' : 'No connections yet'}
                                </p>
                                <p className="text-sm mt-1">
                                    {searchQuery
                                        ? 'Try adjusting your search'
                                        : activeTab === 'all'
                                        ? 'Start connecting with villages and designers'
                                        : activeTab === 'pending-received'
                                        ? 'No pending invitations'
                                        : 'No pending requests'}
                                </p>
                            </div>
                        ) : (
                            filteredData.map((connection) => (
                                <ConnectionCard
                                    key={connection.connectionId}
                                    connection={connection}
                                    showActions={activeTab === 'pending-received'}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                    onMessage={(roomId) => navigate(`/chat/${roomId}`)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

interface ConnectionCardProps {
    connection: Connection
    showActions: boolean
    onAccept: (connectionId: string) => void
    onReject: (connectionId: string) => void
    onMessage: (roomId: string) => void
}

function ConnectionCard({ connection, showActions, onAccept, onReject, onMessage }: ConnectionCardProps) {
    const [accepting, setAccepting] = useState(false)
    const [rejecting, setRejecting] = useState(false)

    const handleAccept = async () => {
        setAccepting(true)
        try {
            await onAccept(connection.connectionId)
        } finally {
            setAccepting(false)
        }
    }

    const handleReject = async () => {
        setRejecting(true)
        try {
            await onReject(connection.connectionId)
        } finally {
            setRejecting(false)
        }
    }

    const getStatusBadge = () => {
        if (connection.status === 'ACCEPTED') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    <Check className="w-3 h-3" />
                    Connected
                </span>
            )
        }
        if (connection.status === 'PENDING') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    <Clock className="w-3 h-3" />
                    Pending
                </span>
            )
        }
        return null
    }

    const getIcon = () => {
        return connection.otherPartyType === 'VILLAGE' ? '🏘️' : '🎨'
    }

    return (
        <div className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
                {/* Left: Avatar and Info */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        connection.otherPartyType === 'VILLAGE'
                            ? 'bg-gradient-to-br from-amber-100 to-amber-300'
                            : 'bg-gradient-to-br from-purple-100 to-purple-300'
                    }`}>
                        <span className="text-2xl">{getIcon()}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                                {connection.otherPartyName}
                            </h3>
                            {getStatusBadge()}
                        </div>
                        <p className="text-sm text-gray-600">
                            {connection.otherPartyType === 'VILLAGE' ? 'Craft Village' : 'Designer'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {connection.status === 'ACCEPTED' 
                                ? `Connected on ${new Date(connection.updatedAt).toLocaleDateString()}`
                                : connection.isRequester
                                ? 'Request sent'
                                : 'Invitation received'}
                        </p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 ml-4">
                    {showActions ? (
                        <>
                            <button
                                onClick={handleAccept}
                                disabled={accepting || rejecting}
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {accepting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Accept'
                                )}
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={accepting || rejecting}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {rejecting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <X className="w-5 h-5" />
                                )}
                            </button>
                        </>
                    ) : connection.status === 'ACCEPTED' ? (
                        <button
                            onClick={() => onMessage(connection.chatRoomId)}
                            className="flex items-center gap-2 px-4 py-2 bg-foreground text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Message
                        </button>
                    ) : connection.status === 'PENDING' && !connection.isRequester ? (
                        <>
                            <button
                                onClick={handleAccept}
                                disabled={accepting || rejecting}
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {accepting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Accept'
                                )}
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={accepting || rejecting}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {rejecting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <X className="w-5 h-5" />
                                )}
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
