import { useState } from 'react'
import { Search, Edit } from 'lucide-react'
import type { ChatRoom } from '@/lib/chat-types'
import ConversationItem from './ConversationItem'

interface ConversationListProps {
    rooms: ChatRoom[]
    activeRoomId?: string
    onSelectRoom: (roomId: string) => void
    loading?: boolean
}

export default function ConversationList({
    rooms,
    activeRoomId,
    onSelectRoom,
    loading = false,
}: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState('')

    // Filter rooms by search query
    const filteredRooms = rooms.filter((room) =>
        room.otherParticipantName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Chat</h2>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                        {searchQuery ? (
                            <p className="text-sm">No conversations found</p>
                        ) : (
                            <>
                                <p className="text-sm">No conversations yet</p>
                                <p className="text-xs mt-1">Start chatting with a village!</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="p-2 space-y-1">
                        {filteredRooms.map((room) => (
                            <ConversationItem
                                key={room.roomId}
                                room={room}
                                isActive={room.roomId === activeRoomId}
                                onClick={() => onSelectRoom(room.roomId)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
