'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Mail, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ForgotPasswordForm {
    email: string;
}

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<ForgotPasswordForm>();

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Something went wrong');
            }

            setIsEmailSent(true);
            // Optional: Redirect to reset page immediately with email query param
            // router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
        } catch (err: any) {
            setError(err.message);
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
                            <p className="text-muted-foreground">
                                Enter your email address and we'll send you an OTP to reset your password.
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
                                    We have sent an OTP to <strong>{getValues('email')}</strong>.
                                </p>
                                <Link
                                    href={`/reset-password?email=${encodeURIComponent(getValues('email'))}`}
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
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address',
                                                },
                                            })}
                                            type="email"
                                            className={`input pl-12 ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full py-3.5 shadow-lg shadow-primary/25"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Send Reset OTP
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
