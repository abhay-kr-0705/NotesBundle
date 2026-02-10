'use client';

import { useState } from 'react';
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
    Check
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export default function SignUpPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        interests: [] as string[],
    });

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

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="w-full max-w-md mx-4">
                    <div className="card p-8 text-center animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-4">Account Created!</h1>
                        <p className="text-muted-foreground mb-8">
                            We've sent a verification email to <strong>{formData.email}</strong>.<br />
                            Please check your inbox and verify your account.
                        </p>
                        <Link
                            href="/login"
                            className="btn-primary w-full py-3 shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 from-transparent to-transparent"
                        >
                            Proceed to Login
                        </Link>
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
                                    <div className="grid grid-cols-2 gap-3">
                                        {CATEGORIES.map((category) => (
                                            <button
                                                key={category.slug}
                                                type="button"
                                                onClick={() => toggleInterest(category.slug)}
                                                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${formData.interests.includes(category.slug)
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                                                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span className="text-2xl mb-2 block transform transition-transform group-hover:scale-110">{category.icon}</span>
                                                <span className="font-medium">{category.name}</span>
                                            </button>
                                        ))}
                                    </div>
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
