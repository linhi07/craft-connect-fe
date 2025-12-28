import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, MapPin, Filter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export default function Hero() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [activeTab, setActiveTab] = useState<'designer' | 'artisan'>('designer')

    const handleSearchClick = () => {
        if (isAuthenticated) {
            navigate('/search')
        } else {
            navigate('/login')
        }
    }

    return (
        <section className="relative bg-white min-h-[300px] pb-20 mb-8">
            {/* Background image with blur at bottom */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src="/craftsperson-hero.jpg"
                    alt="Vietnamese artisan crafting traditional woven hats"
                    className="w-full h-full object-cover"
                />
                {/* Blur overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/70 to-white/40" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="max-w-3xl">
                    {/* Creative Connection tag */}
                    <div className="flex items-center gap-2 text-primary mb-6">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7l2-7z" />
                        </svg>
                        <span className="text-sm font-medium">Creative Connection</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>

                    {/* Main headline */}
                    <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight mb-32">
                        From Villages to Runway,
                        <br />
                        <span className="block mt-2">Find your perfect craft village</span>
                        <span className="block mt-2">
                            match on <span className="text-primary font-medium">CraftConnect</span>
                        </span>
                    </h1>
                </div>
            </div>

            {/* Search/Filter bar - overlaying bottom of image and extending beyond */}
            <div className="absolute -bottom-12 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 lg:p-6">
                        <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 lg:gap-6">
                            {/* Material */}
                            <div className="flex items-center gap-2 lg:gap-3 border-r border-gray-200 pr-4 lg:pr-6">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.53056 19.65L3.87056 20.21V11.18L1.44056 17.04C1.03056 18.06 1.50056 19.23 2.53056 19.65ZM22.0306 15.95L17.0706 4C16.9241 3.63755 16.6745 3.32598 16.3528 3.10382C16.0312 2.88166 15.6514 2.75865 15.2606 2.75C15.0006 2.75 14.7306 2.79 14.4706 2.9L7.10056 5.95C6.74485 6.10096 6.4399 6.35077 6.22188 6.66982C6.00387 6.98886 5.88194 7.36375 5.87056 7.75C5.86056 8 5.91056 8.29 6.00056 8.55L11.0006 20.5C11.2906 21.28 12.0306 21.74 12.8106 21.75C13.0706 21.75 13.3306 21.7 13.5806 21.6L20.9406 18.55C21.4298 18.3497 21.8195 17.9632 22.0238 17.4757C22.2282 16.9881 22.2307 16.4393 22.0306 15.95ZM7.88056 8.75C7.61535 8.75 7.36099 8.64464 7.17346 8.45711C6.98592 8.26957 6.88056 8.01522 6.88056 7.75C6.88056 7.48478 6.98592 7.23043 7.17346 7.04289C7.36099 6.85536 7.61535 6.75 7.88056 6.75C8.43056 6.75 8.88056 7.2 8.88056 7.75C8.88056 8.3 8.43056 8.75 7.88056 8.75ZM5.88056 19.75C5.88056 20.2804 6.09128 20.7891 6.46635 21.1642C6.84142 21.5393 7.35013 21.75 7.88056 21.75H9.33056L5.88056 13.41V19.75Z" fill="#AB2624"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs lg:text-sm font-semibold text-gray-900">Material</p>
                                    <p className="text-xs text-gray-500">Silk Fabrics</p>
                                </div>
                            </div>

                            {/* Ratings */}
                            <div className="flex items-center gap-2 lg:gap-3 border-r border-gray-200 pr-4 lg:pr-6">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.6575 14.583C17.5175 14.583 17.3717 14.5597 17.2317 14.513C16.9686 14.4293 16.7394 14.2635 16.5777 14.0398C16.416 13.8162 16.3303 13.5465 16.3333 13.2705V11.6313C15.015 11.4213 14 10.2722 14 8.89551V5.10384C14 3.57551 15.2425 2.33301 16.7708 2.33301H23.4792C25.0075 2.33301 26.25 3.57551 26.25 5.10384V8.89551C26.25 10.4238 25.0075 11.6663 23.4792 11.6663H20.4925L18.6958 14.058C18.4392 14.3963 18.06 14.583 17.6575 14.583ZM9.33333 16.0413C6.91833 16.0413 4.95833 14.0813 4.95833 11.6663C4.95833 9.25134 6.91833 7.29134 9.33333 7.29134C11.7483 7.29134 13.7083 9.25134 13.7083 11.6663C13.7083 14.0813 11.7483 16.0413 9.33333 16.0413ZM1.75 20.2938C1.75 20.3463 1.8375 25.6663 9.33333 25.6663C16.8292 25.6663 16.9167 20.3463 16.9167 20.2938V19.6872C16.9167 18.4797 15.9367 17.4997 14.7292 17.4997H3.9375C2.73 17.4997 1.75 18.4797 1.75 19.6872V20.2938Z" fill="#AB2624"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs lg:text-sm font-semibold text-gray-900">Ratings</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        5/5 <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 lg:gap-3 border-r border-gray-200 pr-4 lg:pr-6">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.5 1.4375C9.4039 1.43997 7.39435 2.27374 5.91217 3.75592C4.43 5.23809 3.59623 7.24764 3.59375 9.34375C3.59183 11.0566 4.15129 12.7229 5.18651 14.0875C5.18651 14.0875 5.40213 14.3714 5.43735 14.4124L11.5 21.5625L17.5655 14.4088C17.5972 14.3707 17.8135 14.0875 17.8135 14.0875L17.8142 14.0853C18.8487 12.7212 19.4079 11.0558 19.4063 9.34375C19.4038 7.24764 18.57 5.23809 17.0878 3.75592C15.6057 2.27374 13.5961 1.43997 11.5 1.4375ZM11.5 12.2188C10.9314 12.2188 10.3755 12.0501 9.90274 11.7342C9.42995 11.4183 9.06145 10.9693 8.84385 10.444C8.62625 9.91863 8.56931 9.34056 8.68025 8.78287C8.79118 8.22517 9.065 7.71289 9.46707 7.31082C9.86915 6.90874 10.3814 6.63492 10.9391 6.52399C11.4968 6.41306 12.0749 6.46999 12.6002 6.6876C13.1256 6.9052 13.5746 7.27369 13.8905 7.74649C14.2064 8.21928 14.375 8.77513 14.375 9.34375C14.3741 10.106 14.0708 10.8367 13.5319 11.3756C12.9929 11.9146 12.2622 12.2178 11.5 12.2188Z" fill="#AB2624"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs lg:text-sm font-semibold text-gray-900">Location</p>
                                    <p className="text-xs text-gray-500">Ha Noi, Viet Nam</p>
                                </div>
                            </div>

                            {/* Search input */}
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Search . . ."
                                    onClick={handleSearchClick}
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm outline-none focus:border-primary cursor-pointer"
                                />
                            </div>

                            {/* Filter and Search buttons */}
                            <div className="flex items-center gap-2">
                                <button className="p-3 text-primary hover:text-primary-dark bg-red-50 rounded-full transition-colors">
                                    <Filter className="w-5 h-5" />
                                </button>

                                <Button onClick={handleSearchClick} className="bg-primary hover:bg-primary-dark text-white rounded-full p-3 lg:p-4">
                                    <Search className="w-5 h-5 lg:w-6 lg:h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
