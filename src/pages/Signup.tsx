import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Check, Search, MapPin, Users, Clock, Eye, EyeOff, Upload, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface SignupData {
    // Step 1
    fullName: string
    gender: 'male' | 'female' | ''
    countryCode: string
    phoneNumber: string
    birthday: string
    // Step 2
    email: string
    address: string
    // Step 3
    username: string
    password: string
    repeatPassword: string
    agreedToTerms: boolean
}

export default function Signup() {
    const navigate = useNavigate()
    const { register } = useAuth()

    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isLocating, setIsLocating] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)

    const [formData, setFormData] = useState<SignupData>({
        fullName: '',
        gender: '',
        countryCode: '+84',
        phoneNumber: '',
        birthday: '',
        email: '',
        address: '',
        username: '',
        password: '',
        repeatPassword: '',
        agreedToTerms: false,
    })

    const handleInputChange = (field: keyof SignupData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            return
        }

        setIsLocating(true)
        setError('')

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                try {
                    // Use OpenStreetMap Nominatim for reverse geocoding
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    )
                    const data = await response.json()
                    handleInputChange('address', data.display_name || `${latitude}, ${longitude}`)
                } catch {
                    handleInputChange('address', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
                } finally {
                    setIsLocating(false)
                }
            },
            (error) => {
                setError('Unable to get location: ' + error.message)
                setIsLocating(false)
            }
        )
    }

    const handleNext = async () => {
        setError('')

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        } else {
            // Validate step 3
            if (formData.password !== formData.repeatPassword) {
                setError('Passwords do not match')
                return
            }
            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters')
                return
            }
            if (!formData.agreedToTerms) {
                setError('Please agree to the terms of service')
                return
            }

            setIsLoading(true)
            try {
                // Use email as identifier, default to DESIGNER type
                await register(formData.email, formData.password, 'DESIGNER')
                navigate('/')
            } catch (err: unknown) {
                const error = err as { response?: { data?: { message?: string } } }
                setError(error.response?.data?.message || 'Registration failed. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleClose = () => {
        navigate('/')
    }

    const isEmailValid = formData.email.includes('@') && formData.email.includes('.')
    const isPasswordValid = formData.password.length >= 8
    const isRepeatPasswordValid = formData.repeatPassword === formData.password && formData.repeatPassword.length >= 8
    const isUsernameValid = formData.username.length >= 3

    return (
        <div className="min-h-screen flex items-center justify-center bg-accent p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl">
                        <span className="logo-craft text-4xl">CRAFT</span>
                        <span className="logo-connect">CONNECT</span>
                    </h1>
                </div>

                {/* Signup Card */}
                <Card className="shadow-lg rounded-3xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-8">
                        <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
                        <button
                            onClick={handleClose}
                            className="text-muted hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </CardHeader>

                    <CardContent className="space-y-5 px-8 pb-8">
                        {/* Step indicator */}
                        <p className="text-base font-semibold">{currentStep} of 3</p>

                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Personal Info */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full name</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="Full name"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        className="border-border rounded-xl h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <RadioGroup
                                        value={formData.gender}
                                        onValueChange={(value) => handleInputChange('gender', value)}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="male" id="male" />
                                            <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="female" id="female" />
                                            <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="flex items-start gap-2 text-xs text-muted bg-accent p-3 rounded-md">
                                    <span className="shrink-0">ℹ️</span>
                                    <p>The phone number and birthday are only visible to you and the designers connected with you</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone number</Label>
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.countryCode}
                                            onChange={(e) => handleInputChange('countryCode', e.target.value)}
                                            className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-sm h-12"
                                        >
                                            <option value="+84">+84</option>
                                            <option value="+1">+1</option>
                                            <option value="+44">+44</option>
                                        </select>
                                        <Input
                                            placeholder="Phone number"
                                            value={formData.phoneNumber}
                                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                            className="flex-1 border-border rounded-xl h-12"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="birthday">Birthday</Label>
                                    <div className="relative">
                                        <Input
                                            id="birthday"
                                            type="date"
                                            value={formData.birthday}
                                            onChange={(e) => handleInputChange('birthday', e.target.value)}
                                            className="border-border rounded-xl h-12"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
                                            Optional
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Email & Address */}
                        {currentStep === 2 && (
                            <div className="space-y-5">
                                {/* Email field with floating label style */}
                                <div className="relative">
                                    <div className="border border-border rounded-2xl px-4 py-3">
                                        <p className="text-xs text-muted mb-1">Email address</p>
                                        <div className="flex items-center">
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="example@mail.com"
                                                className="flex-1 bg-transparent outline-none text-sm"
                                            />
                                            {isEmailValid && (
                                                <Check className="h-5 w-5 text-green-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Address search field */}
                                <div className="relative">
                                    <div className="border border-border rounded-2xl px-4 py-4 flex items-center gap-3">
                                        <Search className="h-5 w-5 text-muted" />
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Search for address"
                                            className="flex-1 bg-transparent outline-none text-sm text-muted"
                                        />
                                    </div>
                                </div>

                                {/* Location buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleUseCurrentLocation}
                                        disabled={isLocating}
                                        className="text-primary border-primary hover:bg-primary/10 rounded-full px-4"
                                    >
                                        {isLocating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Locating...
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="h-4 w-4 mr-2" />
                                                Use current location
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-primary border-primary hover:bg-primary/10 rounded-full px-4"
                                    >
                                        Add mannualy
                                    </Button>
                                </div>

                                {/* Sharing info - no checkboxes, just labels */}
                                <div className="space-y-3 pt-2">
                                    <p className="text-base font-semibold">Sharing your address shows:</p>

                                    <div className="flex items-center gap-3 text-muted">
                                        <Users className="h-5 w-5" />
                                        <span className="text-sm">People near you</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-muted">
                                        <Clock className="h-5 w-5" />
                                        <span className="text-sm">Moving time</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Username, Password, Certificate */}
                        {currentStep === 3 && (
                            <div className="space-y-5">
                                {/* Username field */}
                                <div className="relative">
                                    <div className="border border-border rounded-2xl px-4 py-3">
                                        <p className="text-xs text-muted mb-1">Username</p>
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => handleInputChange('username', e.target.value)}
                                                placeholder="example"
                                                className="flex-1 bg-transparent outline-none text-sm"
                                            />
                                            {isUsernameValid && (
                                                <Check className="h-5 w-5 text-green-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Password field */}
                                <div className="relative">
                                    <div className="border border-border rounded-2xl px-4 py-3">
                                        <p className="text-xs text-muted mb-1">Password</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                placeholder="********"
                                                className="flex-1 bg-transparent outline-none text-sm"
                                            />
                                            {isPasswordValid && (
                                                <Check className="h-5 w-5 text-green-500" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-muted hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Repeat Password field */}
                                <div className="relative">
                                    <div className="border border-border rounded-2xl px-4 py-3">
                                        <p className="text-xs text-muted mb-1">Repeat the Password</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type={showRepeatPassword ? 'text' : 'password'}
                                                value={formData.repeatPassword}
                                                onChange={(e) => handleInputChange('repeatPassword', e.target.value)}
                                                placeholder="********"
                                                className="flex-1 bg-transparent outline-none text-sm"
                                            />
                                            {isRepeatPasswordValid && (
                                                <Check className="h-5 w-5 text-green-500" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                                className="text-muted hover:text-foreground"
                                            >
                                                {showRepeatPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-muted">8+ characters</p>

                                {/* Certificate upload */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Your Certificate</p>
                                    <div className="border-2 border-dashed border-green-300 bg-green-50/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-colors">
                                        <Upload className="h-8 w-8 text-gray-600 mb-2" />
                                        <span className="text-sm text-gray-600">Upload files</span>
                                    </div>
                                </div>

                                {/* Terms checkbox */}
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="terms"
                                        checked={formData.agreedToTerms}
                                        onCheckedChange={(checked) => handleInputChange('agreedToTerms', !!checked)}
                                        className="mt-0.5"
                                    />
                                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                                        I've read and agreed with terms of service and the privacy policy
                                    </Label>
                                </div>
                            </div>
                        )}

                        {/* Submit button */}
                        <Button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-dark text-white h-12 rounded-xl text-base font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : currentStep < 3 ? (
                                'Save information'
                            ) : (
                                'Register'
                            )}
                        </Button>

                        {/* Sign in link */}
                        <p className="text-center text-sm text-muted pt-2">
                            Already have an account ?{' '}
                            <a href="/login" className="text-foreground font-semibold hover:underline">
                                Sign in
                            </a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
