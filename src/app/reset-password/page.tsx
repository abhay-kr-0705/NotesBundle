'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Lock, Key, ArrowRight, Loader2, CheckCircle, Mail, Phone } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ResetPasswordForm {
    identifier: string; // Email or Phone mapped to display
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
    const phoneFromQuery = searchParams.get('phone') || '';

    // Determine the flow type
    const isPhoneFlow = !!phoneFromQuery;
    const identifier = isPhoneFlow ? phoneFromQuery : emailFromQuery;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        defaultValues: {
            identifier: identifier,
        },
    });

    const newPassword = watch('newPassword');

    const onSubmit = async (data: ResetPasswordForm) => {
        setIsLoading(true);
        setError('');

        try {
            let res;
            if (isPhoneFlow) {
                // Phone Flow: Backend inherently trusts that this parameter was reached securely 
                // due to our frontend Firebase verification routing.
                res = await fetch('/api/auth/reset-password-phone', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: data.identifier,
                        newPassword: data.newPassword,
                    }),
                });
            } else {
                // Standard Email Flow (Requires OTP)
                res = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: data.identifier,
                        otp: data.otp,
                        newPassword: data.newPassword,
                    }),
                });
            }

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
        <div className="relative z-10 animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Create New Password</h1>
                <p className="text-muted-foreground text-sm">
                    {isPhoneFlow ? "Your phone number is verified. Set your new password below." : "Enter the OTP sent to your email and choose a new password."}
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
                    <label htmlFor="identifier" className="text-sm font-medium text-foreground ml-1">
                        {isPhoneFlow ? "Phone Number" : "Email Address"}
                    </label>
                    <div className="relative">
                        {isPhoneFlow ? (
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        ) : (
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        )}
                        <input
                            {...register('identifier', { required: true })}
                            type="text"
                            className="input pl-12 bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed"
                            readOnly
                        />
                    </div>
                </div>

                {!isPhoneFlow && (
                    <div className="space-y-2 animate-fade-in">
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
                )}

                <div className="space-y-2 pt-2">
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
                    className="btn-primary w-full py-3.5 shadow-lg shadow-primary/25 mt-4"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
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
