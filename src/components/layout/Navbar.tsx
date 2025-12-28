import { useState, useEffect } from 'react'
import { Search, Globe, HelpCircle, Heart, Bell, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import NotificationPanel from './NotificationPanel'
import { connectionApi } from '@/lib/connection-api'

const navLinks = [
    { label: 'Blogs', href: '#blogs' },
    { label: 'Chat', href: '/chat' },
    { label: 'Donate', href: '#donate' },
    { label: 'Connection', href: '/connection' },
]

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const { user, isAuthenticated, logout } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')

    // Load accepted notifications count from localStorage
    const getAcceptedNotificationsCount = (): number => {
        try {
            const stored = localStorage.getItem('acceptedConnectionNotifications')
            if (stored) {
                const notifications = JSON.parse(stored)
                return Array.isArray(notifications) ? notifications.length : 0
            }
        } catch {
            return 0
        }
        return 0
    }

    // Fetch unread invitation count + accepted notifications count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!isAuthenticated) return
            
            try {
                const invitations = await connectionApi.getPendingReceived()
                const acceptedCount = getAcceptedNotificationsCount()
                setUnreadCount(invitations.length + acceptedCount)
            } catch (error) {
                console.error('Failed to fetch invitation count:', error)
            }
        }

        fetchUnreadCount()
        
        // Poll every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000)
        
        // Listen for new accepted notifications
        const handleConnectionAccepted = () => {
            fetchUnreadCount()
        }
        window.addEventListener('connectionAccepted', handleConnectionAccepted)
        
        return () => {
            clearInterval(interval)
            window.removeEventListener('connectionAccepted', handleConnectionAccepted)
        }
    }, [isAuthenticated])

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2">
                        {/* Logo icon - craft pattern */}
                        <div className="w-8 h-8 flex items-center justify-center">
                            <svg viewBox="0 0 32 32" className="w-7 h-7">
                                <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <rect x="18" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <rect x="2" y="18" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <rect x="18" y="18" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1" />
                                <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1" />
                                <line x1="24" y1="2" x2="24" y2="14" stroke="currentColor" strokeWidth="1" />
                                <line x1="18" y1="8" x2="30" y2="8" stroke="currentColor" strokeWidth="1" />
                                <line x1="8" y1="18" x2="8" y2="30" stroke="currentColor" strokeWidth="1" />
                                <line x1="2" y1="24" x2="14" y2="24" stroke="currentColor" strokeWidth="1" />
                                <line x1="24" y1="18" x2="24" y2="30" stroke="currentColor" strokeWidth="1" />
                                <line x1="18" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold tracking-wide text-gray-900">CRAFTCONNECT</span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right side - Search, Language, Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Search bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder=""
                                className="w-48 pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Language dropdown */}
                        <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900">
                            <Globe className="h-4 w-4" />
                            <span>Language</span>
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Icon buttons */}
                        <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                                <HelpCircle className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                                <Heart className="h-5 w-5" />
                            </button>
                            
                            {/* Bell icon with notification panel */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors relative"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                                
                                {/* Notification Panel */}
                                <NotificationPanel 
                                    isOpen={isNotificationOpen} 
                                    onClose={() => {
                                        setIsNotificationOpen(false)
                                        // Refresh unread count when closing
                                        const refreshCount = async () => {
                                            try {
                                                const invitations = await connectionApi.getPendingReceived()
                                                const acceptedCount = getAcceptedNotificationsCount()
                                                setUnreadCount(invitations.length + acceptedCount)
                                            } catch (error) {
                                                console.error('Failed to refresh count:', error)
                                            }
                                        }
                                        refreshCount()
                                    }}
                                />
                            </div>

                            {isAuthenticated ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-medium">
                                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                                            {user?.email?.split('@')[0] || 'User'}
                                        </span>
                                        <svg className="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                                            <p className="text-xs text-gray-500">{user?.userType || 'Designer'}</p>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <a
                                    href="/login"
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
                                >
                                    Sign In
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            {/* Mobile search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-primary"
                                />
                            </div>

                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <hr className="border-gray-200" />
                            {isAuthenticated ? (
                                <>
                                    <span className="text-sm text-gray-500">{user?.email}</span>
                                    <button
                                        onClick={logout}
                                        className="text-sm text-left text-gray-700 hover:text-gray-900"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <a
                                    href="/login"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Sign In
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
