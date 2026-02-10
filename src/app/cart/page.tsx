'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Trash2,
    BookOpen,
    Tag,
    ShoppingBag,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
    const { items: cartItems, removeItem, coupon: appliedCoupon, applyCoupon: setAppliedCoupon, removeCoupon: clearAppliedCoupon } = useCartStore();
    const [couponCode, setCouponCode] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);

        // Simulate API call - In production, verify with backend
        setTimeout(() => {
            setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 50, type: 'FLAT' });
            setIsApplyingCoupon(false);
            setCouponCode('');
        }, 1000);
    };

    const removeCoupon = () => {
        clearAppliedCoupon();
        setCouponCode('');
    };

    const subtotal = cartItems.reduce((sum, item) =>
        sum + (item.price), 0 // Assuming price on cart item is final price
    );
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = Math.max(subtotal - discount, 0);

    if (!mounted) {
        return (
            <div className="pt-32 pb-16 min-h-screen">
                <div className="container-custom flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="pt-32 pb-16 min-h-screen">
                <div className="container-custom text-center">
                    <ShoppingBag className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added any notes yet</p>
                    <Link href="/notes" className="btn-primary">
                        Browse Notes
                    </Link>
                </div>
            </div>

        );
    }

    return (
        <div className="pt-20 md:pt-24 pb-32 md:pb-16">
            <div className="container-custom py-8">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="card divide-y divide-border">
                            {cartItems.map((item) => (
                                <div key={item.id} className="p-6 flex gap-4">
                                    <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative">
                                        {item.thumbnailUrl ? (
                                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <BookOpen className="w-10 h-10 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <span className="badge-primary text-xs mb-2">{item.category}</span>
                                                <Link
                                                    href={`/notes/${item.slug}`}
                                                    className="font-semibold text-foreground hover:text-primary block"
                                                >
                                                    {item.title}
                                                </Link>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3 mt-3">
                                            <span className="text-lg font-bold text-foreground">
                                                ₹{item.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>

                            {/* Coupon */}
                            <div className="mb-6">
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between p-3 bg-accent/10 border border-accent/30 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-accent" />
                                            <span className="font-medium text-foreground">{appliedCoupon.code}</span>
                                            <span className="text-accent">-₹{appliedCoupon.discount}</span>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Coupon code"
                                            className="input flex-1"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            disabled={isApplyingCoupon || !couponCode.trim()}
                                            className="btn-secondary px-4"
                                        >
                                            {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Pricing */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-border">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-accent">
                                        <span>Coupon Discount</span>
                                        <span>-₹{discount}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-lg font-bold text-foreground mb-6">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>

                            <Link href="/checkout" className="btn-primary w-full py-3.5">
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <p className="text-xs text-muted-foreground text-center mt-4">
                                Secure checkout powered by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border p-4 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Total</span>
                        <span className="text-xl font-bold text-foreground">₹{total}</span>
                    </div>
                    <Link href="/checkout" className="btn-primary flex-1 py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 text-center">
                        Checkout
                        <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                    </Link>
                </div>
            </div>

        </div>
    );
}
