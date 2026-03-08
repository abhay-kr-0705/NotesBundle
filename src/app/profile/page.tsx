'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    User, Mail, Phone, Edit, BookOpen, ShoppingBag, Heart, Download, Star, ChevronRight, Loader2, Save, X, Lock, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

// Sample data for now
const purchaseHistory: any[] = [];
const wishlistItems: any[] = [];

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const [activeTab, setActiveTab] = useState('purchases');

    // Profile Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', phone: '', email: '' });
    const [originalPhone, setOriginalPhone] = useState('');
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Firebase Phone Verification State
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<any>(null);

    // Fetch user profile from DB on load
    useEffect(() => {
        if (status === 'authenticated') {
            const fetchProfile = async () => {
                try {
                    const res = await fetch('/api/user/profile');
                    if (res.ok) {
                        const data = await res.json();
                        setProfileData({
                            name: data.name || session?.user?.name || '',
                            phone: data.phone || '',
                            email: session?.user?.email || ''
                        });
                        setOriginalPhone(data.phone || '');
                    }
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                } finally {
                    setIsLoadingProfile(false);
                }
            };
            fetchProfile();
        } else if (status === 'unauthenticated') {
            setIsLoadingProfile(false);
        }
    }, [status, session]);

    // Setup Firebase Recaptcha
    useEffect(() => {
        const setupRecaptcha = async () => {
            if (isEditing && !(window as any).recaptchaVerifier) {
                const { auth } = await import('@/lib/firebase');
                const { RecaptchaVerifier } = await import('firebase/auth');
                try {
                    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'profile-recaptcha', {
                        size: 'invisible',
                    });
                } catch (e) {
                    console.error("Recaptcha error:", e);
                }
            }
        };
        setupRecaptcha();
    }, [isEditing]);

    const handleSaveProfile = async () => {
        setMessage({ type: '', text: '' });
        setIsSaving(true);

        // Standard validation
        if (!profileData.name.trim() || !profileData.phone.trim()) {
            setMessage({ type: 'error', text: 'Name and Phone are required.' });
            setIsSaving(false);
            return;
        }

        // If phone changed, we MUST verify with Firebase OTP first
        if (profileData.phone !== originalPhone) {
            try {
                const { auth } = await import('@/lib/firebase');
                const { signInWithPhoneNumber } = await import('firebase/auth');
                const appVerifier = (window as any).recaptchaVerifier;

                const formattedPhone = profileData.phone.startsWith('+') ? profileData.phone : `+91${profileData.phone}`;

                const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
                setConfirmationResult(confirmation);
                setShowOtpInput(true);
                setMessage({ type: 'info', text: 'A verification code has been sent to your new phone number.' });
            } catch (error: any) {
                console.error(error);
                setMessage({ type: 'error', text: 'Failed to send OTP to the new number. Please verify it is correct.' });
            } finally {
                setIsSaving(false);
            }
            return; // Stop here, wait for OTP
        }

        // If phone didn't change, just save normally
        await saveToDatabase();
    };

    const handleVerifyOtpAndSave = async () => {
        if (!confirmationResult || otp.length !== 6) return;
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await confirmationResult.confirm(otp);
            // OTP verified successfully! Now save the rest of the profile
            await saveToDatabase();
            setShowOtpInput(false);
            setOtp('');
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Invalid OTP code. Please try again.' });
            setIsSaving(false);
        }
    };

    const saveToDatabase = async () => {
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: profileData.name, phone: profileData.phone })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to update profile');

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setOriginalPhone(profileData.phone);
            setIsEditing(false);

            // Optionally update NextAuth session
            if (profileData.name !== session?.user?.name) {
                await update({ name: profileData.name });
            }

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSaving(false);
        }
    };


    if (status === 'loading' || isLoadingProfile) {
        return (
            <div className="pt-32 pb-16 text-center min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="pt-40 pb-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <User className="w-20 h-20 text-slate-200 mb-6" />
                <h1 className="text-3xl font-bold text-foreground mb-3">Please Login</h1>
                <p className="text-muted-foreground mb-8 max-w-sm">You need to be logged in to access and manage your profile settings.</p>
                <Link href="/login" className="btn-primary py-3 px-8 text-lg shadow-xl shadow-primary/20">
                    Login to Continue
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-32 pb-16 bg-slate-50 min-h-screen">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* LEFT COLUMN: Profile info & Nav */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="card p-8 text-center shadow-lg shadow-slate-200/50 border-white">
                            <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-5 shadow-inner">
                                {profileData.name?.charAt(0).toUpperCase() || session.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            {isEditing ? (
                                <div className="space-y-4 text-left">
                                    {message.text && (
                                        <div className={`p-3 text-sm rounded-lg flex items-start gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                                            {message.type === 'error' ? <Lock className="w-4 h-4 mt-0.5 shrink-0" /> : <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
                                            <p>{message.text}</p>
                                        </div>
                                    )}

                                    {showOtpInput ? (
                                        <div className="space-y-4 animate-fade-in bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                            <label className="text-sm font-semibold text-slate-700">Verify New Phone</label>
                                            <p className="text-xs text-slate-500 mb-2">Enter the 6-digit code sent to {profileData.phone}</p>
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                className="input font-mono text-center tracking-[0.5em] text-lg"
                                                placeholder="••••••"
                                                maxLength={6}
                                            />
                                            <div className="flex gap-2 pt-2">
                                                <button onClick={() => { setShowOtpInput(false); setIsSaving(false); }} className="btn-secondary flex-1 py-2">Cancel</button>
                                                <button onClick={handleVerifyOtpAndSave} disabled={otp.length !== 6 || isSaving} className="btn-primary flex-1 py-2">
                                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Verify'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="input bg-slate-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block flex justify-between">
                                                    Phone
                                                    {profileData.phone !== originalPhone && <span className="text-amber-500 lowercase normal-case text-[10px] bg-amber-50 px-1.5 rounded">Requires OTP</span>}
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    className="input bg-slate-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Email (Cannot be changed)</label>
                                                <input type="email" value={profileData.email} disabled className="input bg-slate-100 text-slate-500 cursor-not-allowed" />
                                            </div>

                                            <div className="flex gap-2 pt-4">
                                                <button onClick={() => { setIsEditing(false); setProfileData({ ...profileData, phone: originalPhone }); setMessage({ type: '', text: '' }); }} className="btn-secondary flex-1">
                                                    <X className="w-4 h-4 mr-1" /> Cancel
                                                </button>
                                                <button onClick={handleSaveProfile} disabled={isSaving} className="btn-primary flex-1">
                                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <><Save className="w-4 h-4 mr-1" /> Save</>}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{profileData.name}</h2>
                                    <div className="flex items-center justify-center text-slate-500 text-sm mb-2 gap-1.5">
                                        <Mail className="w-3.5 h-3.5" />
                                        {profileData.email}
                                    </div>
                                    <div className="flex items-center justify-center text-slate-500 text-sm mb-6 gap-1.5">
                                        <Phone className="w-3.5 h-3.5" />
                                        {profileData.phone || 'No phone added'}
                                    </div>
                                    <button onClick={() => setIsEditing(true)} className="btn-outline w-full rounded-xl py-2.5 font-semibold text-primary border-primary/20 hover:bg-primary/5">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="card overflow-hidden shadow-lg shadow-slate-200/50 border-white">
                            {[
                                { id: 'purchases', label: 'Purchase History', icon: ShoppingBag },
                                { id: 'downloads', label: 'My Downloads', icon: Download },
                                { id: 'wishlist', label: 'Wishlist', icon: Heart },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 p-4 text-left border-b border-slate-100 last:border-0 transition-all ${activeTab === item.id
                                            ? 'bg-blue-50/50 text-blue-700 border-l-4 border-l-blue-600 font-semibold pl-3'
                                            : 'hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                    {item.label}
                                    <ChevronRight className={`w-4 h-4 ml-auto ${activeTab === item.id ? 'opacity-100 text-blue-600' : 'opacity-0 -translate-x-2'} transition-all`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Content Tabs */}
                    <div className="lg:col-span-3">
                        <div className="card p-8 min-h-[500px] shadow-lg shadow-slate-200/50 border-white">
                            {activeTab === 'purchases' && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <ShoppingBag className="text-primary w-6 h-6" /> Purchase History
                                    </h2>
                                    <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No purchases yet</h3>
                                        <p className="text-slate-500 mb-6">Explore our premium notes and study materials to ace your exams.</p>
                                        <Link href="/notes" className="btn-primary shadow-lg shadow-primary/20">
                                            Browse Premium Notes
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Heart className="text-red-500 w-6 h-6" /> My Wishlist
                                    </h2>
                                    <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <Heart className="w-16 h-16 text-red-100 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-700 mb-2">Your wishlist is empty</h3>
                                        <p className="text-slate-500 mb-6">Save the items you love by clicking the heart icon on any note.</p>
                                        <Link href="/notes" className="btn-secondary">
                                            Discover Notes
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'downloads' && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Download className="text-indigo-500 w-6 h-6" /> My Downloads
                                    </h2>
                                    <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500">Your purchased content will neatly appear here for quick access.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Invisible Recaptcha */}
            <div id="profile-recaptcha"></div>
        </div>
    );
}
