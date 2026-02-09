'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Heart,
    Trash2,
    ShoppingCart,
    ArrowLeft,
    Loader2
} from 'lucide-react';

export default function WishlistPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/wishlist');
        } else if (status === 'authenticated') {
            // Load wishlist from localStorage for now
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                setWishlistItems(JSON.parse(savedWishlist));
            }
            setIsLoading(false);
        }
    }, [status, router]);

    const removeFromWishlist = (noteId: string) => {
        const updated = wishlistItems.filter(item => item.id !== noteId);
        setWishlistItems(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
                        <p className="text-muted-foreground">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="card p-12 text-center">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mb-6">
                            Save items you like by clicking the heart icon on any note
                        </p>
                        <Link href="/notes" className="btn-primary inline-flex">
                            Browse Notes
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="card p-4 flex items-center gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center shrink-0">
                                    <Heart className="w-8 h-8 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/notes/${item.slug}`} className="font-semibold text-foreground hover:text-primary truncate block">
                                        {item.title}
                                    </Link>
                                    <p className="text-sm text-muted-foreground truncate">{item.shortDescription}</p>
                                    <p className="text-primary font-bold mt-1">
                                        {item.price === 0 ? 'Free' : `₹${item.discountPrice || item.price}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <Link
                                        href={`/notes/${item.slug}`}
                                        className="btn-primary px-4 py-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
