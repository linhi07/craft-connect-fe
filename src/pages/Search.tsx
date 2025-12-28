import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, MapPin, Heart, HelpCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { villageApi, materialApi } from '@/lib/api'
import type {
    Village,
    Material,
    Scale,
    Region,
    ProductCategory,
    ProductCharacteristic,
    MarketSegment,
    VillageSearchParams
} from '@/lib/types'

// Filter configuration with enum mappings
const filterCategories = [
    {
        title: 'Organization & Individual Type',
        key: 'scale' as const,
        options: [
            { label: 'Village', value: 'VILLAGE' as Scale },
            { label: 'Individual Artist', value: 'INDIVIDUAL_ARTIST' as Scale },
            { label: 'Association', value: 'ASSOCIATION' as Scale },
        ],
    },
    {
        title: 'Product Category',
        key: 'categories' as const,
        options: [
            { label: 'Raw Materials', value: 'RAW_MATERIALS' as ProductCategory },
            { label: 'Custom Designs', value: 'CUSTOM_DESIGN' as ProductCategory },
            { label: 'Fashion Textiles', value: 'FASHION_TEXTILE' as ProductCategory },
            { label: 'Scarves & Accessories', value: 'SCARVES_ACCESSORIES' as ProductCategory },
            { label: 'Home Decor', value: 'HOME_DECOR' as ProductCategory },
        ],
    },
    {
        title: 'Product Characteristics',
        key: 'characteristics' as const,
        options: [
            { label: 'Handwoven', value: 'HANDWOVEN' as ProductCharacteristic },
            { label: 'Machine-Made', value: 'MACHINE_MADE' as ProductCharacteristic },
            { label: 'Natural-Dyed', value: 'NATURAL_DYED' as ProductCharacteristic },
            { label: 'Eco-friendly', value: 'ECO_FRIENDLY' as ProductCharacteristic },
            { label: 'Others', value: 'OTHERS' as ProductCharacteristic },
        ],
    },
    {
        title: 'Region',
        key: 'region' as const,
        options: [
            { label: 'Northern Vietnam', value: 'NORTHERN_VIETNAM' as Region },
            { label: 'Central Vietnam', value: 'CENTRAL_VIETNAM' as Region },
            { label: 'Southern Vietnam', value: 'SOUTHERN_VIETNAM' as Region },
        ],
    },
    {
        title: 'Market Segmentation',
        key: 'marketSegments' as const,
        options: [
            { label: 'High-end Luxury', value: 'LUXURY' as MarketSegment },
            { label: 'Affordable', value: 'AFFORDABLE' as MarketSegment },
            { label: 'Export-Oriented', value: 'EXPORT_ORIENTED' as MarketSegment },
            { label: 'Locally Focused', value: 'LOCALLY_FOCUSED' as MarketSegment },
        ],
    },
]

// Human-readable label mapping
const labelMap: Record<string, string> = {
    VILLAGE: 'Village',
    INDIVIDUAL_ARTIST: 'Individual Artist',
    ASSOCIATION: 'Association',
    RAW_MATERIALS: 'Raw Materials',
    CUSTOM_DESIGN: 'Custom Designs',
    FASHION_TEXTILE: 'Fashion Textiles',
    SCARVES_ACCESSORIES: 'Scarves & Accessories',
    HOME_DECOR: 'Home Decor',
    HANDWOVEN: 'Handwoven',
    MACHINE_MADE: 'Machine-Made',
    NATURAL_DYED: 'Natural-Dyed',
    ECO_FRIENDLY: 'Eco-friendly',
    OTHERS: 'Others',
    NORTHERN_VIETNAM: 'Northern Vietnam',
    CENTRAL_VIETNAM: 'Central Vietnam',
    SOUTHERN_VIETNAM: 'Southern Vietnam',
    LUXURY: 'High-end Luxury',
    AFFORDABLE: 'Affordable',
    EXPORT_ORIENTED: 'Export-Oriented',
    LOCALLY_FOCUSED: 'Locally Focused',
}

// Rating options - filter by minimum rating value
const ratingOptions = [
    { label: 'All Ratings', value: 0 },
    { label: '5/5', value: 5 },        // Shows only villages with rating = 5.0
    { label: '4/5 & up', value: 4 },   // Shows villages with rating >= 4.0
    { label: '3/5 & up', value: 3 },   // Shows villages with rating >= 3.0
]

// Location options
const locationOptions = [
    { label: 'All Locations', value: '' },
    { label: 'Ha Noi, Viet Nam', value: 'hanoi' },
    { label: 'Ho Chi Minh City', value: 'hcm' },
    { label: 'Da Nang', value: 'danang' },
    { label: 'Hue', value: 'hue' },
    { label: 'Hoi An', value: 'hoian' },
]

export default function SearchPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [submittedQuery, setSubmittedQuery] = useState('') // Query that's been submitted for search
    const [activeTab, setActiveTab] = useState<'designer' | 'artisan'>('designer')
    const [expandedFilters, setExpandedFilters] = useState<string[]>(filterCategories.map(f => f.title))

    // Quick filter states (materialId as number for API, location as string for partial match)
    const [selectedMaterialId, setSelectedMaterialId] = useState<number | undefined>(undefined)
    const [selectedRating, setSelectedRating] = useState(0)
    const [selectedLocation, setSelectedLocation] = useState('')

    // Dropdown open states
    const [materialOpen, setMaterialOpen] = useState(false)
    const [ratingOpen, setRatingOpen] = useState(false)
    const [locationOpen, setLocationOpen] = useState(false)
    const [sortOpen, setSortOpen] = useState(false)

    // Sort state
    const [sortBy, setSortBy] = useState<'rating' | 'name' | 'createdAt'>('rating')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // Dynamic materials from API
    const [materials, setMaterials] = useState<Material[]>([])

    // API state
    const [villages, setVillages] = useState<Village[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalElements, setTotalElements] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)

    // Filter state
    const [selectedScale, setSelectedScale] = useState<Scale | undefined>(undefined)
    const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(undefined)
    const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([])
    const [selectedCharacteristics, setSelectedCharacteristics] = useState<ProductCharacteristic[]>([])
    const [selectedMarketSegments, setSelectedMarketSegments] = useState<MarketSegment[]>([])

    const toggleFilter = (title: string) => {
        setExpandedFilters(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        )
    }

    // Fetch villages from API
    const fetchVillages = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const params: VillageSearchParams = {
                page: currentPage,
                size: 10,
            }

            // Add text search query (use submittedQuery which is set on search button click)
            if (submittedQuery.trim()) params.query = submittedQuery.trim()

            // Quick filters (top bar)
            if (selectedMaterialId) params.materialId = selectedMaterialId
            if (selectedLocation.trim()) params.location = selectedLocation.trim()

            // Sidebar filters
            if (selectedScale) params.scale = selectedScale
            if (selectedRegion) params.region = selectedRegion
            if (selectedCategories.length > 0) params.categories = selectedCategories
            if (selectedCharacteristics.length > 0) params.characteristics = selectedCharacteristics
            if (selectedMarketSegments.length > 0) params.marketSegments = selectedMarketSegments

            // Rating filter (selectedRating is the minimum rating value)
            if (selectedRating > 0) params.minRating = selectedRating

            // Sorting
            params.sortBy = sortBy
            params.sortOrder = sortOrder

            const response = await villageApi.search(params)
            setVillages(response.villages || [])
            setTotalElements(response.totalElements || 0)
        } catch (err) {
            console.error('Failed to fetch villages:', err)
            setError('Failed to load villages. Please try again.')
            setVillages([])
        } finally {
            setLoading(false)
        }
    }, [currentPage, submittedQuery, selectedMaterialId, selectedLocation, selectedRating, sortBy, sortOrder, selectedScale, selectedRegion, selectedCategories, selectedCharacteristics, selectedMarketSegments])

    // Handle search button click
    const handleSearch = () => {
        setSubmittedQuery(searchQuery)
        setCurrentPage(0)
    }

    // Fetch materials from API on mount
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const data = await materialApi.getAll()
                setMaterials(data)
            } catch (err) {
                console.error('Failed to fetch materials:', err)
            }
        }
        fetchMaterials()
    }, [])

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchVillages()
    }, [fetchVillages])

    // Handle checkbox changes
    const handleFilterChange = (key: string, value: string, checked: boolean) => {
        if (key === 'scale') {
            setSelectedScale(checked ? value as Scale : undefined)
        } else if (key === 'region') {
            setSelectedRegion(checked ? value as Region : undefined)
        } else if (key === 'categories') {
            if (checked) {
                setSelectedCategories(prev => [...prev, value as ProductCategory])
            } else {
                setSelectedCategories(prev => prev.filter(c => c !== value))
            }
        } else if (key === 'characteristics') {
            if (checked) {
                setSelectedCharacteristics(prev => [...prev, value as ProductCharacteristic])
            } else {
                setSelectedCharacteristics(prev => prev.filter(c => c !== value))
            }
        } else if (key === 'marketSegments') {
            if (checked) {
                setSelectedMarketSegments(prev => [...prev, value as MarketSegment])
            } else {
                setSelectedMarketSegments(prev => prev.filter(c => c !== value))
            }
        }
        setCurrentPage(0) // Reset to first page on filter change
    }

    // Get active filter tags
    const getActiveTags = () => {
        const tags: string[] = []
        if (selectedScale) tags.push(selectedScale)
        if (selectedRegion) tags.push(selectedRegion)
        tags.push(...selectedCategories)
        tags.push(...selectedCharacteristics)
        tags.push(...selectedMarketSegments)
        return tags
    }

    const removeTag = (tag: string) => {
        if (selectedScale === tag) setSelectedScale(undefined)
        if (selectedRegion === tag) setSelectedRegion(undefined)
        setSelectedCategories(prev => prev.filter(c => c !== tag))
        setSelectedCharacteristics(prev => prev.filter(c => c !== tag))
        setSelectedMarketSegments(prev => prev.filter(c => c !== tag))
    }

    const activeTags = getActiveTags()

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Sub-nav with categories */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6 py-3 text-sm text-gray-600 overflow-x-auto">
                        <span className="whitespace-nowrap hover:text-gray-900 cursor-pointer">Weaving & Embroidery</span>
                        <span className="whitespace-nowrap hover:text-gray-900 cursor-pointer">Wood Carving</span>
                        <span className="whitespace-nowrap hover:text-gray-900 cursor-pointer">Bamboo & Rattan Weaving</span>
                        <span className="whitespace-nowrap hover:text-gray-900 cursor-pointer">Lacquerware</span>
                        <span className="whitespace-nowrap hover:text-gray-900 cursor-pointer">Jewelry & Goldsmithing</span>
                        <span className="whitespace-nowrap hover:text-gray-900 cursor-pointer">More ▾</span>
                    </div>
                </div>
            </div>

            {/* Search header */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Designer/Artisan Toggle */}
                    <div className="inline-flex bg-gray-100 rounded-full p-1 mb-4">
                        <button
                            onClick={() => setActiveTab('designer')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'designer'
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Designer
                        </button>
                        <button
                            onClick={() => setActiveTab('artisan')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'artisan'
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Artisan
                        </button>
                    </div>

                    {/* Filter bar */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Material Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setMaterialOpen(!materialOpen)
                                    setRatingOpen(false)
                                    setLocationOpen(false)
                                }}
                                className="flex items-center gap-2 border-r border-gray-200 pr-4 hover:bg-gray-50 py-1 px-2 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.53056 19.65L3.87056 20.21V11.18L1.44056 17.04C1.03056 18.06 1.50056 19.23 2.53056 19.65ZM22.0306 15.95L17.0706 4C16.9241 3.63755 16.6745 3.32598 16.3528 3.10382C16.0312 2.88166 15.6514 2.75865 15.2606 2.75C15.0006 2.75 14.7306 2.79 14.4706 2.9L7.10056 5.95C6.74485 6.10096 6.4399 6.35077 6.22188 6.66982C6.00387 6.98886 5.88194 7.36375 5.87056 7.75C5.86056 8 5.91056 8.29 6.00056 8.55L11.0006 20.5C11.2906 21.28 12.0306 21.74 12.8106 21.75C13.0706 21.75 13.3306 21.7 13.5806 21.6L20.9406 18.55C21.4298 18.3497 21.8195 17.9632 22.0238 17.4757C22.2282 16.9881 22.2307 16.4393 22.0306 15.95ZM7.88056 8.75C7.61535 8.75 7.36099 8.64464 7.17346 8.45711C6.98592 8.26957 6.88056 8.01522 6.88056 7.75C6.88056 7.48478 6.98592 7.23043 7.17346 7.04289C7.36099 6.85536 7.61535 6.75 7.88056 6.75C8.43056 6.75 8.88056 7.2 8.88056 7.75C8.88056 8.3 8.43056 8.75 7.88056 8.75ZM5.88056 19.75C5.88056 20.2804 6.09128 20.7891 6.46635 21.1642C6.84142 21.5393 7.35013 21.75 7.88056 21.75H9.33056L5.88056 13.41V19.75Z" fill="#AB2624"/>
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-medium text-gray-900">Material</p>
                                    <p className="text-xs text-gray-500">
                                        {selectedMaterialId
                                            ? materials.find(m => m.materialId === selectedMaterialId)?.materialName
                                            : 'All Materials'}
                                    </p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                            {materialOpen && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    {/* All Materials option */}
                                    <button
                                        onClick={() => {
                                            setSelectedMaterialId(undefined)
                                            setMaterialOpen(false)
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!selectedMaterialId ? 'text-primary font-medium' : 'text-gray-700'}`}
                                    >
                                        All Materials
                                    </button>
                                    {/* Dynamic materials from API */}
                                    {materials.map((material) => (
                                        <button
                                            key={material.materialId}
                                            onClick={() => {
                                                setSelectedMaterialId(material.materialId)
                                                setMaterialOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedMaterialId === material.materialId ? 'text-primary font-medium' : 'text-gray-700'}`}
                                        >
                                            {material.materialName}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Ratings Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setRatingOpen(!ratingOpen)
                                    setMaterialOpen(false)
                                    setLocationOpen(false)
                                }}
                                className="flex items-center gap-2 border-r border-gray-200 pr-4 hover:bg-gray-50 py-1 px-2 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.6575 14.583C17.5175 14.583 17.3717 14.5597 17.2317 14.513C16.9686 14.4293 16.7394 14.2635 16.5777 14.0398C16.416 13.8162 16.3303 13.5465 16.3333 13.2705V11.6313C15.015 11.4213 14 10.2722 14 8.89551V5.10384C14 3.57551 15.2425 2.33301 16.7708 2.33301H23.4792C25.0075 2.33301 26.25 3.57551 26.25 5.10384V8.89551C26.25 10.4238 25.0075 11.6663 23.4792 11.6663H20.4925L18.6958 14.058C18.4392 14.3963 18.06 14.583 17.6575 14.583ZM9.33333 16.0413C6.91833 16.0413 4.95833 14.0813 4.95833 11.6663C4.95833 9.25134 6.91833 7.29134 9.33333 7.29134C11.7483 7.29134 13.7083 9.25134 13.7083 11.6663C13.7083 14.0813 11.7483 16.0413 9.33333 16.0413ZM1.75 20.2938C1.75 20.3463 1.8375 25.6663 9.33333 25.6663C16.8292 25.6663 16.9167 20.3463 16.9167 20.2938V19.6872C16.9167 18.4797 15.9367 17.4997 14.7292 17.4997H3.9375C2.73 17.4997 1.75 18.4797 1.75 19.6872V20.2938Z" fill="#AB2624"/>
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-medium text-gray-900">Ratings</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        {ratingOptions.find(o => o.value === selectedRating)?.label || 'All Ratings'}
                                        {selectedRating > 0 && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                    </p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                            {ratingOpen && (
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    {ratingOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSelectedRating(option.value)
                                                setRatingOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${selectedRating === option.value ? 'text-primary font-medium' : 'text-gray-700'
                                                }`}
                                        >
                                            {option.label}
                                            {option.value > 0 && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Location Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setLocationOpen(!locationOpen)
                                    setMaterialOpen(false)
                                    setRatingOpen(false)
                                }}
                                className="flex items-center gap-2 border-r border-gray-200 pr-4 hover:bg-gray-50 py-1 px-2 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.5 1.4375C9.4039 1.43997 7.39435 2.27374 5.91217 3.75592C4.43 5.23809 3.59623 7.24764 3.59375 9.34375C3.59183 11.0566 4.15129 12.7229 5.18651 14.0875C5.18651 14.0875 5.40213 14.3714 5.43735 14.4124L11.5 21.5625L17.5655 14.4088C17.5972 14.3707 17.8135 14.0875 17.8135 14.0875L17.8142 14.0853C18.8487 12.7212 19.4079 11.0558 19.4063 9.34375C19.4038 7.24764 18.57 5.23809 17.0878 3.75592C15.6057 2.27374 13.5961 1.43997 11.5 1.4375ZM11.5 12.2188C10.9314 12.2188 10.3755 12.0501 9.90274 11.7342C9.42995 11.4183 9.06145 10.9693 8.84385 10.444C8.62625 9.91863 8.56931 9.34056 8.68025 8.78287C8.79118 8.22517 9.065 7.71289 9.46707 7.31082C9.86915 6.90874 10.3814 6.63492 10.9391 6.52399C11.4968 6.41306 12.0749 6.46999 12.6002 6.6876C13.1256 6.9052 13.5746 7.27369 13.8905 7.74649C14.2064 8.21928 14.375 8.77513 14.375 9.34375C14.3741 10.106 14.0708 10.8367 13.5319 11.3756C12.9929 11.9146 12.2622 12.2178 11.5 12.2188Z" fill="#AB2624"/>
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-medium text-gray-900">Location</p>
                                    <p className="text-xs text-gray-500">
                                        {locationOptions.find(l => l.value === selectedLocation)?.label || 'Select'}
                                    </p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                            {locationOpen && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    {locationOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSelectedLocation(option.value)
                                                setLocationOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedLocation === option.value ? 'text-primary font-medium' : 'text-gray-700'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search input */}
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search . . ."
                                className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-primary"
                            />
                        </div>

                        {/* Search button */}
                        <Button onClick={handleSearch} className="bg-primary hover:bg-primary-dark text-white rounded-full p-3">
                            <Search className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-4">
                    <span className="hover:text-gray-900 cursor-pointer">Home</span>
                    <span className="mx-2">›</span>
                    <span className="hover:text-gray-900 cursor-pointer">Search</span>
                    <span className="mx-2">›</span>
                    <span className="text-gray-900">Results</span>
                </div>

                <div className="flex gap-8">
                    {/* Left sidebar - Filters */}
                    <div className="w-64 flex-shrink-0 bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-fit">
                        <div className="flex items-center gap-2 mb-2 pb-4 border-b border-gray-200">
                            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="font-semibold text-primary">Filter by:</span>
                        </div>

                        {filterCategories.map((category, idx) => (
                            <div key={category.title} className={`py-3 ${idx < filterCategories.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                <button
                                    onClick={() => toggleFilter(category.title)}
                                    className="flex items-center justify-between w-full text-left"
                                >
                                    <span className="text-sm font-semibold text-gray-900">{category.title}</span>
                                    {expandedFilters.includes(category.title) ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>

                                {expandedFilters.includes(category.title) && (
                                    <div className="space-y-3 mt-3">
                                        {category.options.map((option) => {
                                            const isChecked = category.key === 'scale'
                                                ? selectedScale === option.value
                                                : category.key === 'region'
                                                    ? selectedRegion === option.value
                                                    : category.key === 'categories'
                                                        ? selectedCategories.includes(option.value as ProductCategory)
                                                        : category.key === 'characteristics'
                                                            ? selectedCharacteristics.includes(option.value as ProductCharacteristic)
                                                            : selectedMarketSegments.includes(option.value as MarketSegment)

                                            return (
                                                <label key={option.label} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={(e) => handleFilterChange(category.key, option.value, e.target.checked)}
                                                            className="appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                                                        />
                                                        <svg
                                                            className="w-3 h-3 text-white absolute pointer-events-none"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{option.label}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right side - Results */}
                    <div className="flex-1">
                        {/* Results header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                <span className="text-primary">Villages:</span> found {totalElements} results
                            </h2>
                            <div className="relative">
                                <button
                                    onClick={() => setSortOpen(!sortOpen)}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    <span>Sort by: {sortBy === 'rating' ? 'Top rated' : sortBy === 'name' ? 'Name' : 'Newest'}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {sortOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        <button
                                            onClick={() => { setSortBy('rating'); setSortOrder('desc'); setSortOpen(false) }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'rating' ? 'text-primary font-medium' : 'text-gray-700'}`}
                                        >
                                            Top rated
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('name'); setSortOrder('asc'); setSortOpen(false) }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'name' ? 'text-primary font-medium' : 'text-gray-700'}`}
                                        >
                                            Name (A-Z)
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('createdAt'); setSortOrder('desc'); setSortOpen(false) }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'createdAt' ? 'text-primary font-medium' : 'text-gray-700'}`}
                                        >
                                            Newest first
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active tags */}
                        {activeTags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {activeTags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                    >
                                        {labelMap[tag] || tag}
                                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-primary-dark">×</button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Loading state */}
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                <span className="ml-2 text-gray-600">Loading villages...</span>
                            </div>
                        )}

                        {/* Error state */}
                        {error && !loading && (
                            <div className="text-center py-12">
                                <p className="text-red-500">{error}</p>
                                <Button onClick={fetchVillages} className="mt-4">Try Again</Button>
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && !error && villages.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No villages found matching your criteria.</p>
                            </div>
                        )}

                        {/* Results list */}
                        {!loading && !error && villages.length > 0 && (
                            <div className="space-y-4">
                                {villages.map((village) => (
                                    <div
                                        key={village.villageId}
                                        onClick={() => navigate(`/village/${village.villageId}`)}
                                        className="flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        {/* Image placeholder */}
                                        <div className="w-52 h-44 flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                            <span className="text-4xl">🏘️</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-5">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    {/* Title with stars inline */}
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-bold text-gray-900 text-lg">{village.villageName}</h3>
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < Math.floor(village.rating || 0)
                                                                        ? 'text-amber-400 fill-amber-400'
                                                                        : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                            <span className="text-sm text-gray-500 ml-1">
                                                                {village.rating?.toFixed(1) || '0.0'}/5
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* Location row */}
                                                    <div className="flex items-center gap-6 mt-2">
                                                        <span className="text-sm text-primary">{village.location}</span>
                                                        <a href="#" className="text-sm text-gray-600 underline hover:text-gray-900">
                                                            See in Google Map
                                                        </a>
                                                    </div>
                                                </div>
                                                {/* Action buttons */}
                                                <div className="flex items-center gap-2">
                                                    <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors">
                                                        <HelpCircle className="w-5 h-5" />
                                                    </button>
                                                    <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                                                        <Heart className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-2">
                                                {village.description || 'No description available.'}
                                            </p>

                                            <a href="#" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
                                                View Details
                                            </a>

                                            {/* Tags - pink/rose background */}
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {village.categories?.slice(0, 2).map((cat) => (
                                                    <span
                                                        key={cat}
                                                        className="px-4 py-1.5 bg-rose-50 text-gray-700 text-sm rounded-full border border-rose-100"
                                                    >
                                                        {labelMap[cat] || cat}
                                                    </span>
                                                ))}
                                                {village.characteristics?.slice(0, 1).map((char) => (
                                                    <span
                                                        key={char}
                                                        className="px-4 py-1.5 bg-rose-50 text-gray-700 text-sm rounded-full border border-rose-100"
                                                    >
                                                        {labelMap[char] || char}
                                                    </span>
                                                ))}
                                                {village.region && (
                                                    <span className="px-4 py-1.5 bg-rose-50 text-gray-700 text-sm rounded-full border border-rose-100">
                                                        {labelMap[village.region] || village.region}
                                                    </span>
                                                )}
                                                {(village.categories?.length || 0) + (village.characteristics?.length || 0) > 3 && (
                                                    <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-sm rounded-full border border-gray-200">
                                                        +{(village.categories?.length || 0) + (village.characteristics?.length || 0) - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
