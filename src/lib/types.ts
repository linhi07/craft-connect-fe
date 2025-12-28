// User types matching backend enum
export type UserType = 'DESIGNER' | 'VILLAGE' | 'ADMIN'

// Auth DTOs matching backend
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  userType: UserType
}

export interface AuthResponse {
  token: string
  email: string
  userType: UserType
  message: string
}

// User state
export interface User {
  email: string
  userType: UserType
}

// Enums matching backend
export type Scale = 'VILLAGE' | 'INDIVIDUAL_ARTIST' | 'ASSOCIATION'
export type Region = 'NORTHERN_VIETNAM' | 'CENTRAL_VIETNAM' | 'SOUTHERN_VIETNAM'
export type ProductCategory = 'RAW_MATERIALS' | 'CUSTOM_DESIGN' | 'FASHION_TEXTILE' | 'SCARVES_ACCESSORIES' | 'HOME_DECOR'
export type ProductCharacteristic = 'HANDWOVEN' | 'MACHINE_MADE' | 'NATURAL_DYED' | 'ECO_FRIENDLY' | 'OTHERS'
export type MarketSegment = 'LUXURY' | 'AFFORDABLE' | 'EXPORT_ORIENTED' | 'LOCALLY_FOCUSED'

// Village types matching backend VillageResponse
export interface Village {
  villageId: number
  villageName: string
  contactPerson?: string
  phoneNumber?: string
  websiteUrl?: string
  description: string
  inspirationalStory?: string
  certifications?: string
  location: string
  rating?: number
  scale: Scale
  region: Region
  categories: ProductCategory[]
  characteristics: ProductCharacteristic[]
  marketSegments: MarketSegment[]
}

// Portfolio item for village gallery
export interface PortfolioItem {
  portfolioId: number
  title: string
  description?: string
  imageUrl: string
  createdAt: string
}

// Village Detail Response with all fields for detail page
export interface VillageDetail extends Village {
  profileImageUrl?: string
  email?: string
  craftType?: string
  associationMembership?: string
  keyProducts?: string
  techniques?: string
  productionCapacity?: string
  estimatedCompletionTime?: string
  portfolioItems: PortfolioItem[]
}

// Village Search Request
export interface VillageSearchParams {
  query?: string
  materialId?: number
  location?: string
  minRating?: number
  scale?: Scale
  region?: Region
  categories?: ProductCategory[]
  characteristics?: ProductCharacteristic[]
  marketSegments?: MarketSegment[]
  sortBy?: 'rating' | 'name' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  size?: number
}

// Village Search Response matching backend VillageSearchResponse
export interface VillageSearchResponse {
  villages: Village[]
  currentPage: number
  totalPages: number
  totalElements: number
  size: number
}

// Material type matching backend Material entity
export interface Material {
  materialId: number
  materialName: string
  description?: string
}

// API Error
export interface ApiError {
  message: string
  status: number
}

