import { Button } from '@/components/ui/button'

export default function Achievements() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Content */}
                    <div>
                        {/* Label */}
                        <p className="text-primary font-medium mb-4">Our Achivements</p>

                        {/* We have created */}
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            We have created
                        </h2>
                        <p className="text-3xl lg:text-4xl font-bold mb-4">
                            <span className="text-primary">500+</span> connections
                        </p>
                        <p className="text-gray-600 mb-8">
                            Designers from around the world have teamed up with talented artisans
                            <br />
                            to create one-of-a-kind, handcrafted products
                        </p>

                        {/* Average Artisan Rating */}
                        <p className="text-2xl lg:text-3xl font-bold mb-2">
                            <span className="text-primary">4.8</span> Average Artisan Rating
                        </p>
                        <p className="text-gray-600 mb-8">
                            Our artisans are highly rated by designers for their craftsmanship,
                            <br />
                            communication, and ability to bring creative visions to life
                        </p>

                        {/* CTA Button */}
                        <Button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full text-sm font-medium">
                            MAKE CONNECTION NOW
                        </Button>
                    </div>

                    {/* Right side - Masonry grid layout */}
                    <div className="relative h-[600px]">
                        {/* Top left - medium size */}
                        <div className="absolute left-0 top-0 w-[48%] h-[200px] rounded-3xl overflow-hidden">
                            <img
                                src="/our_achivement1.png"
                                alt="Artisan work"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Top right - small tall */}
                        <div className="absolute right-0 top-0 w-[48%] h-[150px] rounded-3xl overflow-hidden">
                            <img
                                src="/our_achivement2.png"
                                alt="Artisan work"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Middle left - large tall */}
                        <div className="absolute left-0 top-[220px] w-[48%] h-[280px] rounded-3xl overflow-hidden">
                            <img
                                src="/our_achivement3.png"
                                alt="Artisan work"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Middle right - large square */}
                        <div className="absolute right-0 top-[170px] w-[48%] h-[240px] rounded-3xl overflow-hidden">
                            <img
                                src="/our_achivement4.png"
                                alt="Artisan work"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Bottom left - medium */}
                        <div className="absolute left-0 bottom-0 w-[48%] h-[180px] rounded-3xl overflow-hidden">
                            <img
                                src="/our_achivement5.png"
                                alt="Artisan work"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Bottom right - medium */}
                        <div className="absolute right-0 bottom-0 w-[48%] h-[170px] rounded-3xl overflow-hidden">
                            <img
                                src="/our_achivement6.png"
                                alt="Artisan work"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
