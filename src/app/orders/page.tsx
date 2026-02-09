'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Package,
    FileText,
    Download,
    ArrowLeft,
    Loader2,
    Calendar,
    CheckCircle,
    Clock
} from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    items: {
        id: string;
        noteId: string;
        noteTitle: string;
        price: number;
    }[];
}

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/orders');
        } else if (status === 'authenticated') {
            // TODO: Fetch orders from API
            // For now, show empty state
            setIsLoading(false);
        }
    }, [status, router]);

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
                        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
                        <p className="text-muted-foreground">
                            View your purchase history and download your notes
                        </p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="card p-12 text-center">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
                        <p className="text-muted-foreground mb-6">
                            When you purchase notes, they will appear here
                        </p>
                        <Link href="/notes" className="btn-primary inline-flex">
                            Browse Notes
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="card p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="font-semibold text-foreground">
                                            Order #{order.orderNumber}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {order.status === 'COMPLETED' ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm">
                                                <CheckCircle className="w-4 h-4" />
                                                Completed
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-yellow-600 text-sm">
                                                <Clock className="w-4 h-4" />
                                                {order.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="border-t border-border pt-4 space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-primary" />
                                                <span className="text-foreground">{item.noteTitle}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-muted-foreground">₹{item.price}</span>
                                                <button className="btn-secondary px-3 py-1 text-sm">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-border pt-4 mt-4 flex items-center justify-between">
                                    <span className="text-muted-foreground">Total</span>
                                    <span className="font-bold text-foreground">₹{order.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
