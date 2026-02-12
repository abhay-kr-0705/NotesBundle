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
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState('');

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setVerificationError('');

        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            // Redirect to login with verified flag
            router.push('/login?verified=true');
        } catch (err: any) {
            setVerificationError(err.message);
        } finally {
            setIsVerifying(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="w-full max-w-md mx-4">
                    <div className="card p-8 animate-fade-in">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">Verify your email</h1>
                            <p className="text-muted-foreground">
                                We've sent a 6-digit code to <br /><strong>{formData.email}</strong>
                            </p>
                        </div>

                        {verificationError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
                                {verificationError}
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="space-y-5">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                                    Enter Verification Code
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="123456"
                                        className="input !pl-12 tracking-[0.5em] font-mono text-center text-lg"
                                        required
                                        maxLength={6}
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isVerifying || otp.length !== 6}
                                className="btn-primary w-full py-3.5 shadow-lg shadow-blue-500/20"
                            >
                                {isVerifying ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify Email
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
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
                                        Phone Number (Optional)
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
            </div>
        </div>
    );
}
