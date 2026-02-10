'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    BookOpen,
    CreditCard,
    CheckCircle,
    Loader2,
    Shield
} from 'lucide-react';
import { useCartStore, CartItem } from '@/lib/store';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { items: cartItems, clearCart, coupon } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate totals
    const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + (item.price || 0), 0);

    let discount = 0;
    if (coupon) {
        if (coupon.type === 'FLAT') {
            discount = coupon.discount;
        } else if (coupon.type === 'PERCENTAGE') {
            discount = (subtotal * coupon.discount) / 100;
        }
    }

    const total = Math.max(subtotal - discount, 0);

    // Redirect if cart is empty (only after mount to avoid hydration mismatch)
    useEffect(() => {
        if (mounted && cartItems.length === 0) {
            router.push('/cart');
        }
    }, [mounted, cartItems.length, router]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!session) {
            router.push('/login?callbackUrl=/checkout');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            // Load Razorpay script
            const res = await loadRazorpayScript();
            if (!res) {
                setError('Failed to load payment gateway');
                setIsProcessing(false);
                return;
            }

            // Create order
            const orderRes = await fetch('/api/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    noteIds: cartItems.map((item: CartItem) => item.id),
                    couponCode: coupon?.code || '',
                }),
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to create order');
            }

            // Open Razorpay checkout
            const options = {
                key: orderData.key,
                amount: orderData.amount * 100,
                currency: orderData.currency,
                name: 'NotesBundle',
                description: `Order for ${cartItems.length} notes`,
                order_id: orderData.razorpayOrderId,
                prefill: {
                    name: session.user?.name || '',
                    email: session.user?.email || '',
                },
                theme: {
                    color: '#6366f1',
                },
                handler: async (response: any) => {
                    // Verify payment
                    const verifyRes = await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderData.orderId,
                        }),
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyRes.ok) {
                        clearCart(); // Clear cart on success
                        router.push('/checkout/success?orderId=' + orderData.orderId);
                    } else {
                        setError(verifyData.error || 'Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
            setIsProcessing(false);
        }
    };

    if (status === 'loading' || !mounted) {
        return (
            <div className="pt-32 pb-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="pt-20 md:pt-24 pb-32 md:pb-16">
            <div className="container-custom py-8 max-w-4xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Details */}
                    <div>
                        <div className="card p-6 mb-6">
                            <h2 className="font-semibold text-foreground mb-4">Order Details</h2>
                            <div className="space-y-4">
                                {cartItems.map((item: CartItem) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                            {item.thumbnailUrl ? (
                                                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <BookOpen className="w-6 h-6 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                                        </div>
                                        <p className="font-semibold text-foreground">₹{item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* User Info */}
                        {session && (
                            <div className="card p-6">
                                <h2 className="font-semibold text-foreground mb-4">Account Details</h2>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-muted-foreground">Name:</span> {session.user?.name}</p>
                                    <p><span className="text-muted-foreground">Email:</span> {session.user?.email}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Download links will be sent to this email after successful payment.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payment Summary */}
                    <div>
                        <div className="card p-6 sticky top-24">
                            <h2 className="font-semibold text-foreground mb-4">Payment Summary</h2>

                            <div className="space-y-3 mb-6 pb-6 border-b border-border">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                {coupon && (
                                    <div className="flex justify-between text-accent">
                                        <span>Discount ({coupon.code})</span>
                                        <span>-₹{discount}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-xl font-bold text-foreground mb-6">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="btn-primary w-full py-3.5 mb-4"
                            >
                                {isProcessing ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay ₹{total}
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Shield className="w-4 h-4" />
                                <span>Secured by Razorpay</span>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border">
                                <div className="flex items-start gap-3 text-sm">
                                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                    <p className="text-muted-foreground">
                                        Instant download access after payment. Lifetime access to purchased notes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Payment Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border p-4 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="btn-primary w-full py-3.5 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Pay ₹{total}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
