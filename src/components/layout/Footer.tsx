import { Mail, MapPin, Phone } from 'lucide-react'

const navigation = [
    { label: 'Homepage', href: '/' },
    { label: 'About Us', href: '#about' },
    { label: 'Blogs', href: '#blogs' },
    { label: 'Materials', href: '#materials' },
    { label: 'Notification', href: '#notification' },
]

const services = [
    { label: 'Feedback', href: '#feedback' },
    { label: 'Connection', href: '#connection' },
    { label: 'Chat', href: '#chat' },
    { label: 'Donation', href: '#donation' },
]

const legal = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
]

const social = [
    { label: 'Facebook', href: '#' },
    { label: 'Tiktok', href: '#' },
    { label: 'Instagram', href: '#' },
]

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Contact Info */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="font-bold text-gray-900 mb-4">CONTACT INFO</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>0917.338.089</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>Tang 2, so 46 Tang Bat Ho, phuong Pham Dinh Ho, quan Hai Ba Trung, Ha Noi</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>tapchilangnghevietnam@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">NAVIGATION</h3>
                        <ul className="space-y-2">
                            {navigation.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Services */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">OUR SERVICES</h3>
                        <ul className="space-y-2">
                            {services.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">LEGAL</h3>
                        <ul className="space-y-2">
                            {legal.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Follow Us */}
                        <h3 className="font-bold text-gray-900 mt-6 mb-4">FOLLOW US</h3>
                        <ul className="space-y-2">
                            {social.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-200 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <span className="text-white font-bold tracking-wide">CRAFTCONNECT</span>
                        <span className="text-gray-400 text-sm">© 2022 Welcome. All right reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
