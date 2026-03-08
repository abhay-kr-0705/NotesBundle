'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Mail, ArrowRight, Loader2, ChevronLeft, Phone, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ForgotPasswordForm {
    identifier: string; // Can be email OR phone
}

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    // Phone Verification State
    const [inputType, setInputType] = useState<'email' | 'phone'>('email');
    const [showPhoneOtp, setShowPhoneOtp] = useState(false);
    const [phoneOtp, setPhoneOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<any>(null);

    const [error, setError] = useState('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        watch,
    } = useForm<ForgotPasswordForm>();

    const identifierValue = watch('identifier');

    // Auto-detect if user is typing a phone number or email
    useEffect(() => {
        if (!identifierValue) return;
        // If it contains only numbers and perhaps a '+', and is longer than 5 chars, it's likely a phone
        const isLikelyPhone = /^[+\d][\d\s]{5,}$/.test(identifierValue);
        // If it contains '@', it's definitely an email
        const isLikelyEmail = identifierValue.includes('@');

        if (isLikelyPhone && inputType !== 'phone') setInputType('phone');
        if (isLikelyEmail && inputType !== 'email') setInputType('email');
    }, [identifierValue, inputType]);


    // Setup Firebase Recaptcha
    useEffect(() => {
        const setupRecaptcha = async () => {
            if (!(window as any).recaptchaVerifier) {
                const { auth } = await import('@/lib/firebase');
                const { RecaptchaVerifier } = await import('firebase/auth');
                try {
                    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'forgot-password-recaptcha', {
                        size: 'invisible',
                    });
                } catch (e) {
                    console.error("Recaptcha error:", e);
                }
            }
        };
        setupRecaptcha();
    }, []);

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsLoading(true);
        setError('');

        if (inputType === 'phone') {
            // ----- FIREBASE PHONE FLOW -----
            try {
                const { auth } = await import('@/lib/firebase');
                const { signInWithPhoneNumber } = await import('firebase/auth');
                const appVerifier = (window as any).recaptchaVerifier;

                const rawPhone = data.identifier.trim();
                const formattedPhone = rawPhone.startsWith('+') ? rawPhone : `+91${rawPhone}`;

                const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
                setConfirmationResult(confirmation);
                setShowPhoneOtp(true);
            } catch (err: any) {
                console.error(err);
                if (err.code === 'auth/invalid-phone-number') {
                    setError('Invalid phone number format.');
                } else if (err.code === 'auth/too-many-requests') {
                    setError('Too many requests. Please try again later.');
                } else {
                    setError('Failed to send SMS code. Please check the number and try again.');
                }
            } finally {
                setIsLoading(false);
            }

        } else {
            // ----- STANDARD EMAIL FLOW -----
            try {
                const res = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: data.identifier }),
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.error || 'Something went wrong');
                }

                setIsEmailSent(true);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleVerifyPhoneOtp = async () => {
        if (!confirmationResult || phoneOtp.length !== 6) return;
        setIsLoading(true);
        setError('');

        try {
            await confirmationResult.confirm(phoneOtp);
            // OTP verified! We can securely route to the reset-password screen passing the verified phone
            router.push(`/reset-password?phone=${encodeURIComponent(getValues('identifier').trim())}`);
        } catch (err: any) {
            setError('Invalid OTP code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-subtle px-4">
            <div className="w-full max-w-md">
                <div className="card p-8 shadow-2xl animate-fade-in relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -ml-10 -mb-10"></div>

                    <div className="relative z-10">
                        <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Login
                        </Link>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
                            <p className="text-muted-foreground text-sm">
                                Enter your email address or phone number to reset your password.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-start animate-fade-in">
                                <span className="mr-2">⚠️</span>
                                {error}
                            </div>
                        )}

                        {isEmailSent ? (
                            <div className="text-center animate-fade-in">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">Check your email</h3>
                                <p className="text-muted-foreground mb-6">
                                    We have sent an OTP to <strong>{getValues('identifier')}</strong>.
                                </p>
                                <Link
                                    href={`/reset-password?email=${encodeURIComponent(getValues('identifier'))}`}
                                    className="btn-primary w-full py-3 shadow-lg shadow-primary/25"
                                >
                                    Proceed to Reset Password
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                                <button
                                    onClick={() => setIsEmailSent(false)}
                                    className="mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Try a different email
                                </button>
                            </div>
                        ) : showPhoneOtp ? (
                            <div className="text-center animate-fade-in space-y-5">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Smartphone className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground mb-1">Verify Phone Number</h3>
                                    <p className="text-muted-foreground text-sm">Enter the 6-digit OTP sent to {getValues('identifier')}</p>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        value={phoneOtp}
                                        onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="input text-center text-2xl tracking-[0.5em] font-mono py-4"
                                        placeholder="000000"
                                        autoFocus
                                    />
                                </div>

                                <button
                                    onClick={handleVerifyPhoneOtp}
                                    disabled={phoneOtp.length !== 6 || isLoading}
                                    className="btn-primary w-full py-3.5 shadow-lg shadow-primary/25"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Verify Code & Continue'}
                                </button>

                                <button
                                    onClick={() => setShowPhoneOtp(false)}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Change mobile number
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="identifier" className="text-sm font-medium text-foreground ml-1">
                                        Email or Phone Number
                                    </label>
                                    <div className="relative">
                                        {inputType === 'email' ? (
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        ) : (
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        )}
                                        <input
                                            {...register('identifier', {
                                                required: 'Email or Phone is required',
                                            })}
                                            type="text"
                                            className={`input pl-12 ${errors.identifier ? 'border-red-500 focus:ring-red-200' : ''}`}
                                            placeholder="john@example.com or 9876543210"
                                        />
                                    </div>
                                    {errors.identifier && (
                                        <p className="text-xs text-red-500 ml-1">{errors.identifier.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full py-3.5 shadow-lg shadow-primary/25"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                    ) : (
                                        <>
                                            Send Reset OTP
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Invisible Recaptcha */}
                        <div id="forgot-password-recaptcha"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
