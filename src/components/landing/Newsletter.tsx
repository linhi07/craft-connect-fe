import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Newsletter() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    return (
        <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-100 rounded-3xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left side - Text */}
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 italic">
                                Stay In Touch
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Curious about the latest blogs about new
                                projects or new materials? Don't miss out
                                on our newsletters!
                            </p>
                        </div>

                        {/* Right side - Form */}
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name + Lastname"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm outline-none focus:border-primary"
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email addresss"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm outline-none focus:border-primary"
                            />
                            <Button
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/10 px-6 py-2 rounded-lg text-sm font-medium"
                            >
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
