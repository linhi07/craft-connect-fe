import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star } from 'lucide-react'

const categories = [
    { id: 'all', label: 'All', active: true },
    { id: 'fashion', label: 'Fashion Textile', active: false },
    { id: 'scarves', label: 'Scarves & Accessories', active: false },
    { id: 'home', label: 'Home Decor', active: false },
    { id: 'raw', label: 'Raw Materials', active: false },
]

const villages = [
    {
        id: 1,
        name: 'Van Phuc Silk Village',
        location: 'Ha Dong, Hanoi',
        region: 'Northern Vietnam',
        rating: 4.8,
        materials: ['Silk', 'Traditional Weaving'],
        image: '🏘️',
    },
    {
        id: 2,
        name: 'Bat Trang Ceramics',
        location: 'Gia Lam, Hanoi',
        region: 'Northern Vietnam',
        rating: 4.9,
        materials: ['Ceramics', 'Pottery'],
        image: '🏺',
    },
    {
        id: 3,
        name: 'Phu Vinh Bamboo Village',
        location: 'Chuong My, Hanoi',
        region: 'Northern Vietnam',
        rating: 4.7,
        materials: ['Bamboo', 'Rattan'],
        image: '🎋',
    },
    {
        id: 4,
        name: 'Hoi An Lantern Village',
        location: 'Hoi An, Quang Nam',
        region: 'Central Vietnam',
        rating: 4.8,
        materials: ['Silk Lanterns', 'Paper Craft'],
        image: '🏮',
    },
]

export default function WhatWeDo() {
    return (
        <section id="villages" className="py-20 bg-accent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">What We Do</h2>
                        <p className="text-muted">
                            We have connected <span className="text-primary font-semibold">200+ designers</span> with
                            traditional craft villages across Vietnam
                        </p>
                    </div>
                    <Button variant="link" className="text-primary p-0 mt-4 md:mt-0">
                        View all villages →
                    </Button>
                </div>

                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={cat.active ? 'default' : 'outline'}
                            className={cat.active
                                ? 'bg-primary hover:bg-primary-dark text-white'
                                : 'border-border text-muted hover:text-foreground'
                            }
                            size="sm"
                        >
                            {cat.label}
                        </Button>
                    ))}
                </div>

                {/* Village cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {villages.map((village) => (
                        <Card key={village.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-6xl">{village.image}</span>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-1 text-sm text-amber-500 mb-2">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="font-medium">{village.rating}</span>
                                </div>
                                <h3 className="font-semibold mb-1">{village.name}</h3>
                                <p className="text-sm text-muted flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {village.location}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {village.materials.map((mat) => (
                                        <span
                                            key={mat}
                                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                                        >
                                            {mat}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
