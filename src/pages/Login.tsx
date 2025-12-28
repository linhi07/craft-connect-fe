import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await login(username, password)
            navigate('/')
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } }
            setError(error.response?.data?.message || 'Login failed. Please check your credentials.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen flex bg-gray-200 overflow-hidden">
            {/* Login text in corner */}
            <div className="absolute top-4 left-4 text-sm font-medium text-gray-700 z-10">
                Login
            </div>

            {/* Left side - Image */}
            <div className="hidden lg:block lg:w-1/2 h-full">
                <img
                    src="/login-image.png"
                    alt="Vietnamese traditional crafts"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-md space-y-6">
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">LOGIN</h1>
                        <p className="text-primary mt-2">Welcome back! Please login to your account</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username field */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-gray-600 text-sm">Username</Label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="**************"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-600 text-sm">Password</Label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="**************"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-12"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                                    disabled={isLoading}
                                    className="border-gray-300"
                                />
                                <Label htmlFor="rememberMe" className="text-sm text-gray-600 font-normal cursor-pointer">
                                    Remember me
                                </Label>
                            </div>
                            <a href="#" className="text-sm text-primary hover:underline font-medium">
                                Forgot Password
                            </a>
                        </div>

                        {/* Login button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-800 hover:bg-gray-900 text-white h-12 rounded-full text-base font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or Login with</span>
                        </div>
                    </div>

                    {/* Social login buttons */}
                    <div className="flex justify-center gap-4">
                        <button className="flex items-center justify-center w-24 h-12 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>
                        <button className="flex items-center justify-center w-24 h-12 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                        </button>
                        <button className="flex items-center justify-center w-24 h-12 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                            <svg className="h-6 w-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </button>
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-gray-600">
                        New User?{' '}
                        <a href="/signup" className="text-primary font-semibold hover:underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
