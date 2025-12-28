import { Search, Bookmark, MessageCircle, Handshake } from 'lucide-react'

const steps = [
    {
        icon: Search,
        title: 'Find Artisans',
        description: 'Use our powerful search and filter tools to discover artisans that match your specific design needs',
    },
    {
        icon: Bookmark,
        title: 'Select Artisans',
        description: 'Browse through a curated list of artisans that fit your search criteria and preferences',
    },
    {
        icon: MessageCircle,
        title: 'Chat with Artisans',
        description: "Once you've found an artisan you like, start a conversation to discuss your design ideas and project details",
    },
    {
        icon: Handshake,
        title: 'Connect',
        description: 'When you and the artisan are ready to collaborate, click "Connect" to view artisans\' contact and finalize your partnership',
    },
]

export default function HowItWorks() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-primary font-medium mb-2">How CraftConnect Works</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Follow Easy 4 Steps
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Craft Connect makes it easy for designers to connect with skilled artisans from
                        <br />
                        traditional craft villages in Vietnam
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, _index) => (
                        <div
                            key={step.title}
                            className="relative bg-white rounded-2xl p-6 shadow-sm overflow-hidden"
                        >
                            {/* Left red accent border */}
                            <div className="absolute left-0 top-6 bottom-6 w-1 bg-primary rounded-r-full" />

                            {/* Icon */}
                            <div className="mb-4 ml-2">
                                <step.icon className="w-8 h-8 text-primary" />
                            </div>

                            {/* Content */}
                            <h3 className="font-semibold text-gray-900 mb-2 ml-2">{step.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed ml-2">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
