'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    User,
    Mail,
    Phone,
    Edit,
    BookOpen,
    ShoppingBag,
    Heart,
    Download,
    Star,
    ChevronRight,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

// Sample purchase history
const purchaseHistory = [
    {
        id: 'ORD-001',
        date: '2024-01-15',
        items: [
            { title: 'Complete GATE CSE Notes 2024', price: 199, fileUrl: '#' },
        ],
        total: 199,
        status: 'completed',
    },
    {
        id: 'ORD-002',
        date: '2024-01-10',
        items: [
            { title: 'BEU 3rd Semester Notes', price: 199, fileUrl: '#' },
            { title: 'DSA Handwritten Notes', price: 0, fileUrl: '#' },
        ],
        total: 199,
        status: 'completed',
    },
];

const wishlistItems = [
    { id: '1', title: 'GATE ECE Notes 2024', price: 249, rating: 4.7 },
    { id: '2', title: 'Python Complete Guide', price: 149, rating: 4.8 },
];

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState('purchases');
    const [isEditing, setIsEditing] = useState(false);

    if (status === 'loading') {
        return (
            <div className="pt-32 pb-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="pt-32 pb-16 text-center">
                <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Please Login</h1>
                <p className="text-muted-foreground mb-6">You need to be logged in to view your profile</p>
                <Link href="/login" className="btn-primary">
                    Login
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-20 md:pt-24 pb-16">
            <div className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 text-center mb-6">
                            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                                {session.user?.name?.charAt(0) || 'U'}
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-1">{session.user?.name || 'User'}</h2>
                            <p className="text-muted-foreground text-sm mb-4">{session.user?.email}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-outline w-full"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="card p-4 text-center">
                                <p className="text-2xl font-bold text-foreground">{purchaseHistory.length}</p>
                                <p className="text-sm text-muted-foreground">Orders</p>
                            </div>
                            <div className="card p-4 text-center">
                                <p className="text-2xl font-bold text-foreground">{wishlistItems.length}</p>
                                <p className="text-sm text-muted-foreground">Wishlist</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="card overflow-hidden">
                            {[
                                { id: 'purchases', label: 'Purchase History', icon: ShoppingBag },
                                { id: 'wishlist', label: 'Wishlist', icon: Heart },
                                { id: 'downloads', label: 'My Downloads', icon: Download },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 p-4 text-left border-b border-border last:border-0 transition-colors ${activeTab === item.id ? 'bg-primary/5 text-primary' : 'hover:bg-secondary'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'purchases' && (
                            <div>
                                <h2 className="text-xl font-bold text-foreground mb-6">Purchase History</h2>
                                {purchaseHistory.length > 0 ? (
                                    <div className="space-y-4">
                                        {purchaseHistory.map((order) => (
                                            <div key={order.id} className="card p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <p className="font-semibold text-foreground">{order.id}</p>
                                                        <p className="text-sm text-muted-foreground">{order.date}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-foreground">₹{order.total}</p>
                                                        <span className="badge bg-emerald-100 text-emerald-700 capitalize">{order.status}</span>
                                                    </div>
                                                </div>
                                                <div className="border-t border-border pt-4 space-y-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                                                    <BookOpen className="w-6 h-6 text-slate-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-foreground">{item.title}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {item.price > 0 ? `₹${item.price}` : 'Free'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <a href={item.fileUrl} className="btn-primary text-sm py-2">
                                                                <Download className="w-4 h-4" />
                                                                Download
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="card p-12 text-center">
                                        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-foreground mb-2">No purchases yet</h3>
                                        <p className="text-muted-foreground mb-6">Start exploring our notes collection</p>
                                        <Link href="/notes" className="btn-primary">
                                            Browse Notes
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div>
                                <h2 className="text-xl font-bold text-foreground mb-6">My Wishlist</h2>
                                {wishlistItems.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {wishlistItems.map((item) => (
                                            <div key={item.id} className="card p-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                                        <BookOpen className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-foreground mb-1 line-clamp-2">{item.title}</h4>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                            <span className="text-sm font-medium">{item.rating}</span>
                                                        </div>
                                                        <p className="font-semibold text-foreground">₹{item.price}</p>
                                                    </div>
                                                    <button className="text-red-500 hover:text-red-600">
                                                        <Heart className="w-5 h-5 fill-current" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="card p-12 text-center">
                                        <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</h3>
                                        <p className="text-muted-foreground mb-6">Save notes you like for later</p>
                                        <Link href="/notes" className="btn-primary">
                                            Browse Notes
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'downloads' && (
                            <div>
                                <h2 className="text-xl font-bold text-foreground mb-6">My Downloads</h2>
                                <div className="space-y-4">
                                    {purchaseHistory.flatMap((order) =>
                                        order.items.map((item, idx) => (
                                            <div key={`${order.id}-${idx}`} className="card p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                                        <BookOpen className="w-6 h-6 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{item.title}</p>
                                                        <p className="text-sm text-muted-foreground">Purchased on {order.date}</p>
                                                    </div>
                                                </div>
                                                <a href={item.fileUrl} className="btn-primary text-sm py-2">
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </a>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
