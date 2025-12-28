const valueCards = [
    {
        image: '/our_values1.png',
        text: 'Explore new stories and materials with our talent artisans',
    },
    {
        image: '/our_values2.png',
        text: 'Explore new stories and materials with our talent artisans',
    },
    {
        image: '/our_values3.png',
        text: 'Explore new stories and materials with our talent artisans',
    },
]

export default function OurValues() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-primary font-medium mb-2">Our Values</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        What we brings
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        From Villages to Runway. Find your perfect craft village match on
                        <br />
                        CraftConnect. From Villages to Runway
                    </p>
                </div>

                {/* Value cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {valueCards.map((card, index) => (
                        <div
                            key={index}
                            className="flex items-stretch bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                        >
                            {/* Image */}
                            <div className="relative w-1/2 min-h-[200px]">
                                <img
                                    src={card.image}
                                    alt="Artisan work"
                                    className="w-full h-full object-cover"
                                />
                                {/* Yellow/orange gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/40 to-transparent" />
                            </div>

                            {/* Text */}
                            <div className="w-1/2 p-6 flex items-center">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {card.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
