
export default function Partners() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-primary font-medium mb-2">Introduce</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Our Partners
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We always choose reliable partners to work with We always choose reliable
                        <br />
                        partners to work with
                    </p>
                </div>

                {/* Partner cards */}
                <div className="grid md:grid-cols-3 gap-8 items-center justify-items-center">
                    {/* Partner 1 */}
                    <div className="text-center">
                        <div className="w-48 h-64 mx-auto mb-4 shadow-lg rounded overflow-hidden">
                            <img
                                src="/partner1.png"
                                alt="Partner 1"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Partner 2 */}
                    <div className="text-center">
                        <div className="w-48 h-64 mx-auto mb-4 shadow-lg rounded overflow-hidden">
                            <img
                                src="/partner2.png"
                                alt="Partner 2"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Partner 3 */}
                    <div className="text-center">
                        <div className="w-48 h-64 mx-auto mb-4 shadow-lg rounded overflow-hidden">
                            <img
                                src="/partner3.png"
                                alt="Partner 3"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
