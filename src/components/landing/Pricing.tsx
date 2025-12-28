import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
    {
        name: 'Basic',
        price: '$0.00',
        period: '/month',
        description: 'All the basics for businesses that are just getting started',
        featured: false,
        features: [
            { text: 'Only have information of 5 artisans', included: true },
            { text: 'No connection or chat with artisans', included: false },
            { text: 'Can only view blog', included: true },
        ],
    },
    {
        name: 'Standard',
        price: '$9.89',
        period: '/month',
        description: 'Advanced features for pros who need more connections',
        featured: true,
        features: [
            { text: 'See all experienced artisans', included: true },
            { text: 'Free connection and chat with artisans', included: true },
            { text: 'Can view and write blog', included: true },
            { text: "Can get artisans' contact", included: true },
        ],
    },
    {
        name: '$25.00',
        price: '$25.00',
        period: '/3 months',
        description: 'Unlock long-term connections with premium features at a better price',
        featured: false,
        features: [
            { text: 'Free trial for 7 days', included: true },
            { text: 'See all experienced artisans', included: true },
            { text: 'Free connection and chat with artisans', included: true },
            { text: 'Can view and write blog', included: true },
            { text: "Can get artisans' contact", included: true },
        ],
    },
]

export default function Pricing() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-primary font-medium mb-2">Pricing Table</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        Choose the plan that's right for you
                    </h2>
                </div>

                {/* Pricing cards */}
                <div className="grid md:grid-cols-3 gap-6 items-start">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={`rounded-2xl p-6 ${plan.featured
                                    ? 'bg-white shadow-lg border-2 border-gray-100 -mt-4 mb-4 py-8'
                                    : 'bg-gray-100'
                                }`}
                        >
                            {/* Price */}
                            <div className="mb-4">
                                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                                <span className="text-gray-500 text-sm">{plan.period}</span>
                            </div>

                            {/* Plan name (for Basic) or just description */}
                            {index === 0 && (
                                <h3 className="font-semibold text-gray-900 mb-2">Basic</h3>
                            )}
                            {index === 1 && (
                                <h3 className="font-semibold text-gray-900 mb-2">Standard</h3>
                            )}

                            <p className="text-sm text-gray-600 mb-6">{plan.description}</p>

                            <hr className="border-gray-200 mb-6" />

                            {/* Features */}
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature) => (
                                    <li key={feature.text} className="flex items-start gap-2">
                                        {feature.included ? (
                                            <Check className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                        )}
                                        <span className={`text-sm ${feature.included ? 'text-gray-600' : 'text-red-500'}`}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Subscribe button */}
                            <Button
                                className={`w-full rounded-full py-3 font-medium ${plan.featured
                                        ? 'bg-primary hover:bg-primary-dark text-white'
                                        : 'bg-gray-800 hover:bg-gray-900 text-white'
                                    }`}
                            >
                                Subcribe
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
