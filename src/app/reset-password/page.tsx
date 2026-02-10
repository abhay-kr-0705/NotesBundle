'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Lock, Key, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ResetPasswordForm {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

function ResetPasswordFormContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromQuery = searchParams.get('email') || '';

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        defaultValues: {
            email: emailFromQuery,
        },
    });

    const newPassword = watch('newPassword');

    const onSubmit = async (data: ResetPasswordForm) => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    otp: data.otp,
                    newPassword: data.newPassword,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Something went wrong');
            }

            setIsSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center animate-fade-in py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">Password Reset Successful!</h1>
                <p className="text-muted-foreground mb-8">
                    Your password has been updated. You will be redirected to the login page shortly.
                </p>
                <Link
                    href="/login"
                    className="btn-primary px-8 py-3 shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 from-transparent to-transparent"
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="relative z-10">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
                <p className="text-muted-foreground">
                    Enter the OTP sent to your email and choose a new password.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-start animate-fade-in">
                    <span className="mr-2">⚠️</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            type="email"
                            className={`input ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="john@example.com"
                        // readOnly={!!emailFromQuery} // Optional: make readonly if verified flow
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="otp" className="text-sm font-medium text-foreground ml-1">
                        One-Time Password (OTP)
                    </label>
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            {...register('otp', {
                                required: 'OTP is required',
                                minLength: { value: 6, message: 'OTP must be 6 digits' },
                                maxLength: { value: 6, message: 'OTP must be 6 digits' },
                            })}
                            type="text"
                            maxLength={6}
                            className={`input pl-12 tracking-widest font-mono text-lg ${errors.otp ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="123456"
                        />
                    </div>
                    {errors.otp && (
                        <p className="text-xs text-red-500 ml-1">{errors.otp.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium text-foreground ml-1">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            {...register('newPassword', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters',
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                                    message:
                                        'Must include uppercase, lowercase, number, and special char',
                                },
                            })}
                            type="password"
                            className={`input pl-12 ${errors.newPassword ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.newPassword && (
                        <p className="text-xs text-red-500 ml-1">{errors.newPassword.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground ml-1">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) =>
                                    value === newPassword || 'Passwords do not match',
                            })}
                            type="password"
                            className={`input pl-12 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : ''}`}
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500 ml-1">{errors.confirmPassword.message}</p>
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
                            Reset Password
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-subtle px-4">
            <div className="w-full max-w-md">
                <div className="card p-8 shadow-2xl animate-fade-in relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -ml-10 -mb-10"></div>

                    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                        <ResetPasswordFormContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
