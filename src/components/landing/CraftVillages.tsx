import { Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const villages = [
    {
        name: 'Van Phuc Silk Village',
        description: 'Famous for its soft silk fabrics, sophisticated patterns. Van Phuc silk products are always highly appreciated, both beautiful and durable',
        image: '/vanphuc.jpg',
        rating: 4,
    },
    {
        name: 'Kim Son Sedge Village',
        description: 'As a traditional sedge craft village for over 200 years, Kim Son has sophisticated and diverse sedge products, from daily household items to beautiful decorative items',
        image: '/kimson.jpg',
        rating: 5,
    },
    {
        name: 'My Nghiep Brocade Weaving Village',
        description: 'This is an ancient Cham craft village that has been passed down to this day. The brocade products, after being finished, often have quite delicate and elegant colors',
        image: '/mynghiep.jpg',
        rating: 5,
    },
    {
        name: 'Van Lam Embroidery Village',
        description: 'In Van Lam today, with embroidery frames of all sizes and through the delicate and colorful threads on selected fabrics, exquisite works of art are born',
        image: '/vanlam.jpg',
        rating: 5,
    },
    {
        name: 'Chuon Ngo mother-of-pearl inlay village',
        description: 'The characteristic is that the unbreakable, sturdy mother-of-pearl pieces are delicately decorated, very lively and unique',
        image: '/chuonngo.jpg',
        rating: 5,
    },
    {
        name: 'Ke Mon Jewelry Village',
        description: 'Famous for its excellent quality jewelry products made from gold or silver such as bracelets, rings, necklaces, earrings. They are crafted by...',
        image: '/kemon.jpeg',
        rating: 5,
    },
]

export default function CraftVillages() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-primary font-medium mb-2">Explore</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Craft Villages of the Month
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        From Villages to Runway. Find your perfect craft village match on
                        <br />
                        CraftConnect. From Villages to Runway
                    </p>
                </div>

                {/* Village cards grid with blur effect on bottom row */}
                <div className="relative mb-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {villages.map((village, index) => (
                            <div
                                key={village.name}
                                className="flex bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
                            >
                                {/* Image */}
                                <div className="w-1/3 min-h-[180px]">
                                    <img
                                        src={village.image}
                                        alt={village.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="w-2/3 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                                            {village.name}
                                        </h3>
                                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                                            {village.description}
                                        </p>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex gap-1 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${
                                                    i < village.rating
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Fade overlay for bottom row - gradient fade effect */}
                                {index >= 3 && (
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white/90 pointer-events-none" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Floating Subscribe Button */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
                        <Button className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 rounded-full text-base font-semibold shadow-xl transition-all">
                            SUBSCRIBE TO SEE MORE
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
