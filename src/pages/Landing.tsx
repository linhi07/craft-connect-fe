import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/landing/Hero'
import Welcome from '@/components/landing/Welcome'
import AboutUs from '@/components/landing/AboutUs'
import OurValues from '@/components/landing/OurValues'
import Achievements from '@/components/landing/Achievements'
import CraftVillages from '@/components/landing/CraftVillages'
import Partners from '@/components/landing/Partners'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import Donation from '@/components/landing/Donation'
import Testimonials from '@/components/landing/Testimonials'
import Newsletter from '@/components/landing/Newsletter'
import BotCiCiWidget from '@/components/botcici/BotCiCiWidget'
import BotCiCiDialog from '@/components/botcici/BotCiCiDialog'
import { useAuth } from '@/context/AuthContext'

export default function Landing() {
    const { isAuthenticated } = useAuth()

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                <Hero />
                <Welcome />
                <AboutUs />
                <OurValues />
                <Achievements />
                <CraftVillages />
                <Partners />
                <HowItWorks />
                <Donation />
                <Testimonials />
                <Newsletter />
            </main>
            <Footer />
            
            {/* BotCiCi Chatbot - Only show when logged in */}
            {isAuthenticated && (
                <>
                    <BotCiCiWidget />
                    <BotCiCiDialog />
                </>
            )}
        </div>
    )
}
