import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Phone, Mail, Award, ChevronDown, ChevronUp, MapPin, Info, CheckCircle2, Lightbulb, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { villageApi } from '@/lib/api'
import { chatApi } from '@/lib/chat-api'
import { useAuth } from '@/context/AuthContext'
import type { VillageDetail } from '@/lib/types'

// Collapsible section component
interface SectionProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    titleColor?: string
}

function CollapsibleSection({ title, children, defaultOpen = true, titleColor = 'text-primary' }: SectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 ${titleColor} font-semibold text-lg mb-3 hover:opacity-80 transition-opacity`}
            >
                {title}
                {isOpen ? (
                    <ChevronUp className="w-5 h-5" />
                ) : (
                    <ChevronDown className="w-5 h-5" />
                )}
            </button>
            {isOpen && <div className="text-gray-700">{children}</div>}
        </div>
    )
}

// List item with checkmark
function CheckItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 mb-2">
            <Check className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{children}</span>
        </div>
    )
}

// Category with lightbulb icon
function CategoryItem({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-sm text-gray-900">{title}</span>
            </div>
            <div className="pl-6">{children}</div>
        </div>
    )
}

export default function VillageDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [village, setVillage] = useState<VillageDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [startingChat, setStartingChat] = useState(false)

    useEffect(() => {
        const fetchVillage = async () => {
            if (!id) return

            setLoading(true)
            setError(null)

            try {
                const data = await villageApi.getById(parseInt(id))
                setVillage(data)
            } catch (err) {
                console.error('Failed to fetch village:', err)
                setError('Failed to load village details. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchVillage()
    }, [id])

    // Parse newline-separated text into array
    const parseLines = (text?: string): string[] => {
        if (!text) return []
        return text.split('\n').filter(line => line.trim())
    }

    // Parse certifications into structured data
    const parseCertifications = (text?: string): { title: string; description: string }[] => {
        if (!text) return []
        // Simple split by double newline or treat as single entries
        const lines = text.split('\n').filter(line => line.trim())
        // Group into title/description pairs or just use as titles
        return lines.map(line => ({ title: line, description: '' }))
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        )
    }

    if (error || !village) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500">{error || 'Village not found'}</p>
                </div>
                <Footer />
            </div>
        )
    }

    const keyProducts = parseLines(village.keyProducts)
    const techniques = parseLines(village.techniques)
    const certifications = parseCertifications(village.certifications)
    const portfolioImages = village.portfolioItems || []

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Left Sidebar */}
                    <div className="w-48 flex-shrink-0">
                        {/* Profile Image */}
                        <div className="flex flex-col items-center">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mb-4">
                                {village.profileImageUrl ? (
                                    <img
                                        src={village.profileImageUrl}
                                        alt={village.villageName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                        <span className="text-3xl">🏘️</span>
                                    </div>
                                )}
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
                                {village.villageName}
                            </h2>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Heart className="w-5 h-5" />
                                <span className="text-sm">Favorite</span>
                            </button>
                            <button
                                onClick={async () => {
                                    if (!id || startingChat) return

                                    // Check if user is authenticated
                                    if (!isAuthenticated) {
                                        navigate('/login')
                                        return
                                    }

                                    try {
                                        setStartingChat(true)
                                        const room = await chatApi.startChat(parseInt(id))
                                        navigate(`/chat/${room.roomId}`)
                                    } catch (err: unknown) {
                                        console.error('Failed to start chat:', err)
                                        // Check if it's an auth error
                                        const error = err as { response?: { status?: number } }
                                        if (error?.response?.status === 401 || error?.response?.status === 403) {
                                            navigate('/login')
                                        } else {
                                            alert('Failed to start chat. Please try again.')
                                        }
                                    } finally {
                                        setStartingChat(false)
                                    }
                                }}
                                disabled={startingChat}
                                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {startingChat ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <MessageCircle className="w-5 h-5" />
                                )}
                                <span className="text-sm">{startingChat ? 'Starting...' : 'Chat'}</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Phone className="w-5 h-5" />
                                <span className="text-sm">Phone</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Mail className="w-5 h-5" />
                                <span className="text-sm">Email</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Award className="w-5 h-5" />
                                <span className="text-sm">Certificate</span>
                            </button>
                        </div>

                        {/* Connect Button */}
                        <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold py-3">
                            CONNECT NOW
                        </Button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Image Gallery */}
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            {/* First large image */}
                            <div className="col-span-1 row-span-2">
                                {portfolioImages[0] ? (
                                    <img
                                        src={portfolioImages[0].imageUrl}
                                        alt={portfolioImages[0].title}
                                        className="w-full h-full object-cover rounded-lg"
                                        style={{ aspectRatio: '1/1' }}
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center">
                                        <span className="text-6xl">🧶</span>
                                    </div>
                                )}
                            </div>

                            {/* Second image */}
                            <div className="col-span-1">
                                {portfolioImages[1] ? (
                                    <img
                                        src={portfolioImages[1].imageUrl}
                                        alt={portfolioImages[1].title}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gradient-to-br from-pink-100 to-red-200 rounded-lg flex items-center justify-center">
                                        <span className="text-4xl">🪡</span>
                                    </div>
                                )}
                            </div>

                            {/* Third and fourth images stacked */}
                            <div className="col-span-1 space-y-2">
                                {portfolioImages[2] ? (
                                    <img
                                        src={portfolioImages[2].imageUrl}
                                        alt={portfolioImages[2].title}
                                        className="w-full h-[62px] object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-[62px] bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🎨</span>
                                    </div>
                                )}
                                <div className="relative">
                                    {portfolioImages[3] ? (
                                        <>
                                            <img
                                                src={portfolioImages[3].imageUrl}
                                                alt={portfolioImages[3].title}
                                                className="w-full h-[62px] object-cover rounded-lg"
                                            />
                                            {portfolioImages.length > 4 && (
                                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-semibold">+{portfolioImages.length - 4}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-[62px] bg-gradient-to-br from-green-100 to-teal-200 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">🌿</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Fifth image (below second) */}
                            <div className="col-span-1">
                                {portfolioImages[4] ? (
                                    <img
                                        src={portfolioImages[4].imageUrl}
                                        alt={portfolioImages[4].title}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-violet-200 rounded-lg flex items-center justify-center">
                                        <span className="text-4xl">🎭</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                            {/* Association Membership Badge */}
                            {village.associationMembership && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <span className="text-sm text-gray-700">{village.associationMembership}</span>
                                </div>
                            )}

                            {/* Location Badge */}
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-5 h-5" />
                                <span className="text-sm">{village.location}</span>
                            </div>

                            {/* Craft Type Badge */}
                            {village.craftType && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Info className="w-5 h-5" />
                                    <span className="text-sm">{village.craftType}</span>
                                </div>
                            )}
                        </div>

                        {/* Introduction Section */}
                        <CollapsibleSection title="Introduction">
                            <p className="text-sm leading-relaxed">{village.description}</p>
                        </CollapsibleSection>

                        {/* Inspirational Story Section */}
                        {village.inspirationalStory && (
                            <CollapsibleSection title="Inspirational Story">
                                <p className="text-sm leading-relaxed">{village.inspirationalStory}</p>
                            </CollapsibleSection>
                        )}

                        {/* Products & Techniques Section */}
                        {(keyProducts.length > 0 || techniques.length > 0) && (
                            <CollapsibleSection title="Products & Techniques">
                                {keyProducts.length > 0 && (
                                    <CategoryItem title="Key Products">
                                        {keyProducts.map((product, idx) => (
                                            <CheckItem key={idx}>{product}</CheckItem>
                                        ))}
                                    </CategoryItem>
                                )}
                                {techniques.length > 0 && (
                                    <CategoryItem title="Techniques">
                                        {techniques.map((technique, idx) => (
                                            <CheckItem key={idx}>{technique}</CheckItem>
                                        ))}
                                    </CategoryItem>
                                )}
                            </CollapsibleSection>
                        )}

                        {/* Production Capacity Section */}
                        {(village.productionCapacity || village.estimatedCompletionTime) && (
                            <CollapsibleSection title="Production Capacity">
                                {village.productionCapacity && (
                                    <CategoryItem title="Capacity">
                                        <CheckItem>{village.productionCapacity}</CheckItem>
                                    </CategoryItem>
                                )}
                                {village.estimatedCompletionTime && (
                                    <CategoryItem title="Estimated Time to Completion">
                                        <CheckItem>{village.estimatedCompletionTime}</CheckItem>
                                    </CategoryItem>
                                )}
                            </CollapsibleSection>
                        )}

                        {/* Certificate and Awards Section */}
                        {certifications.length > 0 && (
                            <CollapsibleSection title="Certificate and Awards">
                                {certifications.map((cert, idx) => (
                                    <CategoryItem key={idx} title={cert.title}>
                                        {cert.description && <p className="text-sm text-gray-600">{cert.description}</p>}
                                    </CategoryItem>
                                ))}
                            </CollapsibleSection>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
