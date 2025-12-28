import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export default function SupportCTA() {
    return (
        <section className="py-20 bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <Heart className="h-12 w-12 mx-auto mb-6 opacity-80" />

                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    YOUR SUPPORT IS REALLY MEANINGFUL
                </h2>

                <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                    Help us preserve traditional Vietnamese crafts and connect artisans with
                    opportunities worldwide. Every connection makes a difference.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="lg"
                        className="bg-white text-primary hover:bg-white/90 rounded-full px-8"
                    >
                        Support a Village
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 rounded-full px-8"
                    >
                        Learn More
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-12 max-w-lg mx-auto">
                    <div>
                        <p className="text-3xl font-bold">$50K+</p>
                        <p className="text-sm opacity-75">Funds Raised</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">500+</p>
                        <p className="text-sm opacity-75">Supporters</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">20+</p>
                        <p className="text-sm opacity-75">Projects</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
