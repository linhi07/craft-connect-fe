import { Check } from 'lucide-react'

const stats = [
    { value: '1.800+', label: 'Craft village' },
    { value: '10.000', label: 'Experienced artisans' },
    { value: '12', label: 'Diverse craft sectors' },
]

const features = [
    'Connect Generations',
    'Connect World',
    'Connect Creation',
]

export default function AboutUs() {
    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Blurred red background layer */}
            <div className="absolute inset-0 bg-red-50/40 backdrop-blur-3xl" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Image collage */}
                    <div className="relative h-[500px]">
                        {/* Large left image - colorful fans/crafts */}
                        <div className="absolute left-0 top-0 w-[280px] h-[380px] rounded-[60px] overflow-hidden shadow-2xl z-10">
                            <img
                                src="/image.png"
                                alt="Colorful traditional crafts"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Top right rounded rectangle image - weaving hands */}
                        <div className="absolute left-[200px] top-[20px] w-[280px] h-[200px] rounded-[40px] overflow-hidden shadow-2xl z-20 border-[12px] border-white">
                            <img
                                src="/f73b00d7-342a-4d2c-b5dc-4c8fd3070704.png"
                                alt="Traditional weaving hands"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Bottom rounded rectangle image - artisan with baskets */}
                        <div className="absolute left-[140px] top-[240px] w-[320px] h-[240px] rounded-[40px] overflow-hidden shadow-2xl z-15 border-[12px] border-white">
                            <img
                                src="/df09f677-06f3-4362-9199-863f2d2b40c5.png"
                                alt="Artisan with traditional baskets"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div>
                        {/* About Us label */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-primary font-medium">About Us</span>
                            <div className="w-12 h-0.5 bg-gray-400" />
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            NOT ONLY <span className="text-primary">CRAFT CONNECTION</span>
                            <br />
                            BUT WE ALSO...
                        </h2>

                        {/* Feature list */}
                        <ul className="space-y-3 mb-8">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <div className="text-primary">
                                        <Check className="w-5 h-5" strokeWidth={3} />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Stats */}
                        <div className="flex gap-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className={`flex-1 p-4 rounded-xl text-center ${index === 0 ? 'bg-gray-50' : 'bg-gray-100'
                                        }`}
                                >
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
