import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authApi } from '@/lib/api'
import type { User, UserType, LoginRequest, RegisterRequest } from '@/lib/types'

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, userType: UserType) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        const request: LoginRequest = { email, password }
        const response = await authApi.login(request)

        // Store token and user
        localStorage.setItem('token', response.token)
        const userData: User = { email: response.email, userType: response.userType }
        localStorage.setItem('user', JSON.stringify(userData))

        setToken(response.token)
        setUser(userData)
    }

    const register = async (email: string, password: string, userType: UserType) => {
        const request: RegisterRequest = { email, password, userType }
        const response = await authApi.register(request)

        // Store token and user
        localStorage.setItem('token', response.token)
        const userData: User = { email: response.email, userType: response.userType }
        localStorage.setItem('user', JSON.stringify(userData))

        setToken(response.token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
        window.location.href = '/'
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
