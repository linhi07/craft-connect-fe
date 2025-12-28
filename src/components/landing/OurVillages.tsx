const regionStats = [
    { region: 'Northern Vietnam', villages: 25, color: 'bg-primary' },
    { region: 'Central Vietnam', villages: 15, color: 'bg-amber-500' },
    { region: 'Southern Vietnam', villages: 10, color: 'bg-emerald-500' },
]

export default function OurVillages() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        Our Villages at the <span className="text-primary">Heart</span>
                    </h2>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Traditional craft villages spread across all regions of Vietnam,
                        each with unique heritage and specializations
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Map placeholder */}
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-8xl">🗺️</span>
                                <p className="mt-4 text-muted">Interactive Map Coming Soon</p>
                            </div>
                        </div>

                        {/* Stats badges */}
                        <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-3">
                            <p className="text-2xl font-bold text-primary">50+</p>
                            <p className="text-xs text-muted">Total Villages</p>
                        </div>
                    </div>

                    {/* Region stats */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold">Villages by Region</h3>

                        {regionStats.map((stat) => (
                            <div key={stat.region} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{stat.region}</span>
                                    <span className="text-muted">{stat.villages} villages</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${stat.color} rounded-full transition-all`}
                                        style={{ width: `${(stat.villages / 25) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="pt-6 grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-accent rounded-lg">
                                <p className="text-2xl font-bold text-primary">15+</p>
                                <p className="text-xs text-muted">Materials</p>
                            </div>
                            <div className="p-4 bg-accent rounded-lg">
                                <p className="text-2xl font-bold text-primary">5</p>
                                <p className="text-xs text-muted">Categories</p>
                            </div>
                            <div className="p-4 bg-accent rounded-lg">
                                <p className="text-2xl font-bold text-primary">100%</p>
                                <p className="text-xs text-muted">Authentic</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
