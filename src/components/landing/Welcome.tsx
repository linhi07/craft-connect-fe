import { Button } from '@/components/ui/button'

export default function Welcome() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* About Us label */}
                <p className="text-primary font-medium mb-4">About Us</p>

                {/* Heading */}
                <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-6">
                    Welcome to CraftConnect
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    We strive to unite the expertise of village artisans with the vision of designers,
                    <br />
                    fostering a world where cultural richness informs modern innovation.
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-4">
                    <Button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full text-sm font-medium">
                        EXPLORE
                    </Button>

                </div>
            </div>
        </section>
    )
}
