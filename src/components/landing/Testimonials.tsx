const images = [
    '/Testimonials1.png',
    '/Testimonials2.png',
    '/Testimonials3.png',
    '/Testimonials4.png',
    '/Testimonials5.png',
    '/Testimonials6.png',
]

const testimonials = [
    {
        quote: 'Craft Connect is a perfect bridge between designers and the craft community, and I am very proud to have the opportunity to support artisans through this platform. I will definitely return and continue to collaborate, as well as donate more in the future',
        author: 'Elizabeth Joe',
        role: 'Fashion Designer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    },
    {
        quote: 'Craft Connect is a perfect bridge between designers and the craft community, and I am very proud to have the opportunity to support artisans through this platform. I will definitely return and continue to collaborate, as well as donate more in the future',
        author: 'Elizabeth Joe',
        role: 'Fashion Designer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    },
    {
        quote: 'Craft Connect is a perfect bridge between designers and the craft community, and I am very proud to have the opportunity to support artisans through this platform. I will definitely return and continue to collaborate, as well as donate more in the future',
        author: 'Elizabeth Joe',
        role: 'Fashion Designer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    },
]

export default function Testimonials() {
    return (
        <section className="py-16 bg-white">
            {/* Image gallery - Full width */}
            <div className="w-full overflow-hidden mb-12">
                <div className="flex gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-1/6 h-48 overflow-hidden rounded-lg shadow-md"
                        >
                            <img
                                src={image}
                                alt={`Artisan ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonial cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="space-y-4">
                            {/* Quote icon */}
                            <div className="text-primary text-4xl font-serif">"</div>

                            {/* Quote text */}
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {testimonial.quote}
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.author}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{testimonial.author}</p>
                                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
