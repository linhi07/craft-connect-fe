import axios, { AxiosError, type AxiosInstance } from 'axios'
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  VillageDetail,
  VillageSearchParams,
  VillageSearchResponse,
  ApiError 
} from './types'

// API base URL - change this for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data)
    return response.data
  },
}

// Village API
export const villageApi = {
  search: async (params?: VillageSearchParams): Promise<VillageSearchResponse> => {
    // Build query params - arrays need to be joined as comma-separated values
    const queryParams: Record<string, string | number | undefined> = {}
    
    if (params?.query?.trim()) queryParams.query = params.query.trim()
    if (params?.materialId) queryParams.materialId = params.materialId
    if (params?.location?.trim()) queryParams.location = params.location.trim()
    if (params?.minRating && params.minRating > 0) queryParams.minRating = params.minRating
    if (params?.scale) queryParams.scale = params.scale
    if (params?.region) queryParams.region = params.region
    if (params?.categories?.length) queryParams.categories = params.categories.join(',')
    if (params?.characteristics?.length) queryParams.characteristics = params.characteristics.join(',')
    if (params?.marketSegments?.length) queryParams.marketSegments = params.marketSegments.join(',')
    if (params?.sortBy) queryParams.sortBy = params.sortBy
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder
    if (params?.page !== undefined) queryParams.page = params.page
    if (params?.size !== undefined) queryParams.size = params.size

    const response = await api.get<VillageSearchResponse>('/api/villages', { params: queryParams })
    return response.data
  },

  getById: async (id: number): Promise<VillageDetail> => {
    const response = await api.get<VillageDetail>(`/api/villages/${id}`)
    return response.data
  },
}

// Material API
import type { Material } from './types'

export const materialApi = {
  getAll: async (): Promise<Material[]> => {
    const response = await api.get<Material[]>('/api/materials')
    return response.data
  },
}

export default api
