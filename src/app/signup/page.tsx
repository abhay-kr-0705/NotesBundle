'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    BookOpen,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    User,
    Phone,
    Check,
    GraduationCap,
    Trophy,
    Code,
    FileText,
    Book,
    Sparkles
} from 'lucide-react';

const categoryIconMap: { [key: string]: any } = {
    'gate': GraduationCap,
    'engineering': BookOpen,
    'competitive': Trophy,
    'coding': Code,
    'pyqs': FileText,
    'handbooks': Book,
};

interface DynamicCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
}

export default function SignUpPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [dynamicCategories, setDynamicCategories] = useState<DynamicCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        interests: [] as string[],
    });

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/admin/categories');
                if (res.ok) {
                    const data = await res.json();
                    // Only show top-level categories (no parentId)
                    setDynamicCategories(data.filter((c: any) => !c.parentId));
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const [isSuccess, setIsSuccess] = useState(false);

    const toggleInterest = (slug: string) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.includes(slug)
                ? prev.interests.filter((i) => i !== slug)
                : [...prev.interests, slug],
        }));
    };

    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [verificationMethod, setVerificationMethod] = useState<'phone' | 'email'>('phone');
    const [confirmationResult, setConfirmationResult] = useState<any>(null);

    // Initialize Firebase Recaptcha
    useEffect(() => {
        const setupRecaptcha = async () => {
            if (!(window as any).recaptchaVerifier) {
                const { auth } = await import('@/lib/firebase');
                const { RecaptchaVerifier } = await import('firebase/auth');

                try {
                    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        size: 'invisible',
                        callback: (response: any) => {
                            // reCAPTCHA solved
                        }
                    });
                } catch (e) {
                    console.error("Recaptcha initialization error:", e);
                }
            }
        };
        setupRecaptcha();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            // Validate step 1
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            // Password complexity check
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                setError('Please meet all password requirements');
                return;
            }

            setError('');
            setStep(2);
            return;
        }

        // Submit registration
        setIsLoading(true);
        setError('');

        try {
            // 1. Create unverified account (Skip Email OTP initially)
            const registerResponse = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, skipEmailOtp: true }),
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                // If it fails due to existing account etc, throw
                throw new Error(registerData.error || 'Registration failed');
            }

            // 2. Trigger Firebase SMS OTP
            const { auth } = await import('@/lib/firebase');
            const { signInWithPhoneNumber } = await import('firebase/auth');
            const appVerifier = (window as any).recaptchaVerifier;

            // Format phone number to E.164 (assuming India for now)
            const formattedPhone = formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone}`;

            try {
                const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
                setConfirmationResult(confirmation);
                setVerificationMethod('phone');
                setIsSuccess(true);
            } catch (fbError: any) {
                console.warn("Firebase SMS error, falling back to Email Verification:", fbError);

                // Fallback to sending Email OTP automatically
                try {
                    const emailOtpResponse = await fetch('/api/auth/send-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: formData.email }),
                    });

                    if (!emailOtpResponse.ok) {
                        throw new Error('Failed to send fallback Email OTP');
                    }

                    setVerificationMethod('email');
                    setIsSuccess(true); // Proceed to OTP screen
                } catch (fallbackError) {
                    throw new Error("Failed to send OTP via Phone and Email. Please try logging in and requesting a new code.");
                }
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyPhone = async () => {
        if (!confirmationResult) return;
        try {
            // 1. Verify with Firebase
            await confirmationResult.confirm(otp);

            // 2. Mark verified in our DB
            const response = await fetch('/api/auth/verify-phone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });

            if (!response.ok) throw new Error('Failed to update verification status');

            router.push('/login?verified=true');
        } catch (err: any) {
            throw new Error(err.code === 'auth/invalid-verification-code' ? 'Invalid OTP code' : 'Verification failed');
        }
    };

    const handleVerifyEmail = async () => {
        const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, otp }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Verification failed');

        router.push('/login?verified=true');
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setVerificationError('');

        try {
            if (verificationMethod === 'phone') {
                await handleVerifyPhone();
            } else {
                await handleVerifyEmail();
            }
        } catch (err: any) {
            setVerificationError(err.message);
        } finally {
            setIsVerifying(false);
        }
    };

    const switchToEmailVerification = async () => {
        setIsVerifying(true);
        setVerificationError('');
        try {
            // Request backend to send email OTP
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });

            if (!response.ok) throw new Error('Failed to send Email OTP');

            setVerificationMethod('email');
            setOtp('');
        } catch (err: any) {
            setVerificationError('Failed to send Email OTP. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="w-full max-w-md mx-4">
                    <div className="card p-8 animate-fade-in shadow-xl shadow-primary-500/5 border-primary/10">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {verificationMethod === 'phone' ? (
                                    <Phone className="w-8 h-8 text-blue-600" />
                                ) : (
                                    <Mail className="w-8 h-8 text-blue-600" />
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                Verify your {verificationMethod === 'phone' ? 'phone' : 'email'}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                We've sent a 6-digit code to <br />
                                <strong className="text-foreground text-base">
                                    {verificationMethod === 'phone' ? formData.phone : formData.email}
                                </strong>
                            </p>
                        </div>

                        {verificationError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6 flex items-start gap-3">
                                <div className="p-1 bg-red-100 rounded-full mt-0.5">
                                    <EyeOff className="w-4 h-4 text-red-600" />
                                </div>
                                <p className="font-medium">{verificationError}</p>
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="space-y-6">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-semibold text-foreground mb-2">
                                    Enter 6-digit Code
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="••••••"
                                        className="input !pl-12 tracking-[0.5em] font-mono text-center text-xl h-14 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                        required
                                        maxLength={6}
                                        minLength={6}
                                        autoComplete="one-time-code"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isVerifying || otp.length !== 6}
                                className="btn-primary w-full h-14 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all font-semibold text-base"
                            >
                                {isVerifying ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying code...
                                    </>
                                ) : (
                                    <>
                                        Verify & Create Account
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Fallback Option */}
                        {verificationMethod === 'phone' && (
                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <p className="text-sm text-slate-500 mb-3">Didn't receive the SMS?</p>
                                <button
                                    onClick={switchToEmailVerification}
                                    disabled={isVerifying}
                                    className="text-primary hover:text-indigo-700 font-semibold text-sm inline-flex items-center gap-2 hover:bg-slate-50 py-2 px-4 rounded-full transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    Send OTP to Email instead
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="w-full max-w-md mx-4">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                            <BookOpen className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-foreground font-display">
                            Notes<span className="text-primary">Bundle</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
                    <p className="text-muted-foreground">
                        {step === 1 ? 'Enter your details to get started' : 'Select your interests for personalized recommendations'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-primary text-white' : 'bg-secondary'}`}>
                            {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Account</span>
                    </div>
                    <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-border'}`}></div>
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-primary text-white' : 'bg-secondary'}`}>
                            2
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Interests</span>
                    </div>
                </div>

                {/* Form */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {step === 1 ? (
                            <>
                                {/* Step 1: Account Details */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter your full name"
                                            className="input !pl-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Enter your email"
                                            className="input !pl-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Enter your phone number"
                                            className="input !pl-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="Create a password"
                                            className="input !pl-12 !pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Password Requirements */}
                                    <div className="mt-3 space-y-2 text-xs text-muted-foreground bg-slate-50 p-3 rounded-lg border border-border">
                                        <p className="font-medium mb-1">Password must contain:</p>
                                        <div className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-green-600' : 'bg-slate-300'}`}></div>
                                            At least 8 characters
                                        </div>
                                        <div className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-600' : 'bg-slate-300'}`}></div>
                                            One uppercase letter
                                        </div>
                                        <div className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-600' : 'bg-slate-300'}`}></div>
                                            One lowercase letter
                                        </div>
                                        <div className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(formData.password) ? 'bg-green-600' : 'bg-slate-300'}`}></div>
                                            One number
                                        </div>
                                        <div className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-600' : 'bg-slate-300'}`}></div>
                                            One special character (e.g., ! @ # $)
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            placeholder="Confirm your password"
                                            className="input !pl-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary w-full py-3.5 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                                    Continue
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Step 2: Interests */}
                                <div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Select the categories you&apos;re interested in (at least 1):
                                    </p>
                                    {categoriesLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                            <span className="ml-2 text-muted-foreground text-sm">Loading categories...</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {dynamicCategories.map((category) => {
                                                const IconComponent = categoryIconMap[category.slug] || Sparkles;
                                                const isSelected = formData.interests.includes(category.slug);
                                                return (
                                                    <button
                                                        key={category.id}
                                                        type="button"
                                                        onClick={() => toggleInterest(category.slug)}
                                                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 relative overflow-hidden ${isSelected
                                                            ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-primary/10 text-primary'
                                                            }`}>
                                                            <IconComponent className="w-5 h-5" />
                                                        </div>
                                                        <span className={`font-medium text-sm block ${isSelected ? 'text-indigo-700' : 'text-foreground'
                                                            }`}>
                                                            {category.name}
                                                        </span>
                                                        {category.description && (
                                                            <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 block">
                                                                {category.description}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="btn-secondary flex-1 py-3.5"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || formData.interests.length === 0}
                                        className="btn-primary flex-1 py-3.5 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    By signing up, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </p>

                {/* Invisible Recaptcha Container for Firebase */}
                <div id="recaptcha-container"></div>
            </div>
        </div>
    );
}
