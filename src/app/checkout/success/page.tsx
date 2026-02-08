'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    CheckCircle,
    Download,
    Mail,
    Home,
    BookOpen
} from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="pt-32 pb-16">
            <div className="container-custom text-center max-w-lg mx-auto">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-accent" />
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Thank you for your purchase. Your order has been confirmed.
                </p>

                <div className="card p-6 mb-8 text-left">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                            <p className="font-medium text-foreground">Check your email</p>
                            <p className="text-sm text-muted-foreground">Download links have been sent to your registered email</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-primary" />
                        <div>
                            <p className="font-medium text-foreground">Access your downloads</p>
                            <p className="text-sm text-muted-foreground">You can also download from your profile anytime</p>
                        </div>
                    </div>
                </div>

                {orderId && (
                    <p className="text-sm text-muted-foreground mb-8">
                        Order ID: <span className="font-mono font-medium text-foreground">{orderId}</span>
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/profile" className="btn-primary">
                        <Download className="w-5 h-5" />
                        Go to Downloads
                    </Link>
                    <Link href="/" className="btn-secondary">
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="pt-32 pb-16 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
