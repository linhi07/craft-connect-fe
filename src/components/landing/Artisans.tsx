import { Card, CardContent } from '@/components/ui/card'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

const artisans = [
    {
        id: 1,
        name: 'Mrs. Nguyen Van',
        village: 'Van Phuc Silk',
        image: '👩‍🦳',
        story: 'Third generation silk weaver keeping the tradition alive for over 40 years',
        likes: 234,
        comments: 45,
    },
    {
        id: 2,
        name: 'Mr. Tran Duc',
        village: 'Bat Trang',
        image: '👨‍🦱',
        story: 'Master ceramist creating fusion of traditional and contemporary designs',
        likes: 189,
        comments: 32,
    },
    {
        id: 3,
        name: 'Mrs. Le Thi',
        village: 'Phu Vinh',
        image: '👩',
        story: 'Award-winning bamboo artisan specializing in eco-friendly products',
        likes: 312,
        comments: 67,
    },
]

export default function Artisans() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        Follow Our <span className="text-primary">Artisans</span>
                    </h2>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Get inspired by the stories of master craftspeople preserving Vietnam's heritage
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {artisans.map((artisan) => (
                        <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Header */}
                            <div className="p-4 flex items-center gap-3 border-b border-border">
                                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                                    <span className="text-2xl">{artisan.image}</span>
                                </div>
                                <div>
                                    <p className="font-semibold">{artisan.name}</p>
                                    <p className="text-sm text-muted">{artisan.village}</p>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                <span className="text-8xl opacity-50">🧶</span>
                            </div>

                            <CardContent className="p-4">
                                <p className="text-sm text-muted mb-4">{artisan.story}</p>

                                {/* Actions */}
                                <div className="flex items-center gap-4 text-muted">
                                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                        <Heart className="h-4 w-4" />
                                        <span className="text-sm">{artisan.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                        <MessageCircle className="h-4 w-4" />
                                        <span className="text-sm">{artisan.comments}</span>
                                    </button>
                                    <button className="ml-auto hover:text-primary transition-colors">
                                        <Share2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
