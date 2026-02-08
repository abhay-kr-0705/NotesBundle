'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Trash2,
    Plus,
    Minus,
    BookOpen,
    Tag,
    ShoppingBag,
    ArrowRight,
    Loader2
} from 'lucide-react';

// Sample cart data
const initialCartItems = [
    {
        id: '1',
        title: 'Complete GATE CSE Notes 2024',
        slug: 'gate-cse-complete-notes-2024',
        category: 'GATE',
        price: 299,
        discountPrice: 199,
    },
    {
        id: '2',
        title: 'BEU 3rd Semester All Subjects',
        slug: 'beu-sem-3-notes',
        category: 'Engineering',
        price: 199,
        discountPrice: null,
    },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const removeItem = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);

        // Simulate API call
        setTimeout(() => {
            setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 50 });
            setIsApplyingCoupon(false);
        }, 1000);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };

    const subtotal = cartItems.reduce((sum, item) =>
        sum + (item.discountPrice || item.price), 0
    );
    const discount = appliedCoupon?.discount || 0;
    const total = Math.max(subtotal - discount, 0);

    if (cartItems.length === 0) {
        return (
            <div className="pt-32 pb-16">
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
        <div className="pt-20 md:pt-24 pb-16">
            <div className="container-custom py-8">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="card divide-y divide-border">
                            {cartItems.map((item) => (
                                <div key={item.id} className="p-6 flex gap-4">
                                    <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                        <BookOpen className="w-10 h-10 text-slate-400" />
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
                                                ₹{item.discountPrice || item.price}
                                            </span>
                                            {item.discountPrice && (
                                                <span className="text-muted-foreground line-through">₹{item.price}</span>
                                            )}
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
        </div>
    );
}
