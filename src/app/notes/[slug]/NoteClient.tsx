'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Star,
    BookOpen,
    Download,
    ShoppingCart,
    Heart,
    Share2,
    ChevronRight,
    FileText,
    Languages,
    Eye,
    CheckCircle,
    Clock,
    Share,
    X,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import PDFPreview from '@/components/PDFPreview'; // Import the component

interface NoteClientProps {
    note: any; // Type this properly if possible, or use any for now
    relatedNotes: any[];
}

export default function NoteClient({ note, relatedNotes }: NoteClientProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [showPreview, setShowPreview] = useState(false); // State for preview modal
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const isInCart = useCartStore((state) => state.isInCart);

    const handleAddToCart = () => {
        addItem({
            id: note.id,
            title: note.title,
            slug: note.slug,
            price: note.price,
            thumbnailUrl: note.thumbnailUrl,
            category: note.category?.name,
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/checkout');
    };

    // Calculate discount percentage
    const discountPercentage = note.price && note.discountPrice
        ? Math.round(((note.price - note.discountPrice) / note.price) * 100)
        : 0;

    return (
        <div className="pt-20 md:pt-24 pb-16">
            {/* Breadcrumb */}
            <div className="bg-gradient-subtle border-b border-border">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/notes" className="hover:text-primary">Notes</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href={`/category/${note.category?.slug || 'general'}`} className="hover:text-primary">{note.category?.name || 'General'}</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground line-clamp-1">{note.title}</span>
                    </nav>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Preview & Details */}
                    <div className="lg:col-span-2">
                        {/* Preview Image */}
                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden group">
                            {note.thumbnailUrl ? (
                                <img src={note.thumbnailUrl} alt={note.title} className="w-full h-full object-cover" />
                            ) : (
                                <BookOpen className="w-24 h-24 text-slate-300" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="btn bg-white text-foreground hover:scale-105 transition-transform duration-200 shadow-xl rounded-full px-6 py-3 font-medium"
                                >
                                    <Eye className="w-5 h-5 text-primary" />
                                    Preview ({note.previewPages || 5} pages)
                                </button>
                            </div>
                            {/* Mobile visible preview button */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 lg:hidden">
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="btn bg-white text-foreground shadow-xl rounded-full px-6 py-3 font-medium"
                                >
                                    <Eye className="w-5 h-5 text-primary" />
                                    Preview
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-border mb-6">
                            <div className="flex gap-8">
                                {['description', 'reviews', 'faq'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 font-medium capitalize transition-colors relative ${activeTab === tab
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'description' && (
                            <div className="prose prose-slate max-w-none">
                                <p className="text-lg text-muted-foreground mb-6">{note.description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="card p-4 text-center">
                                        <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <p className="font-semibold">{note.pages || 0} Pages</p>
                                    </div>
                                    <div className="card p-4 text-center">
                                        <Languages className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <p className="font-semibold">English</p>
                                    </div>
                                    <div className="card p-4 text-center">
                                        <Download className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <p className="font-semibold">PDF</p>
                                    </div>
                                    <div className="card p-4 text-center">
                                        <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <p className="font-semibold">Updated</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div>
                                <div className="card p-6 mb-6">
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold text-foreground mb-2">{(note.averageRating || 0).toFixed(1)}</div>
                                            <div className="flex items-center gap-1 justify-center mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < Math.floor(note.averageRating || 0)
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-slate-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{note.totalReviews || 0} reviews</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-center py-8">No reviews yet.</p>
                            </div>
                        )}

                        {activeTab === 'faq' && (
                            <div className="space-y-4">
                                {[
                                    { q: 'How will I receive the notes after purchase?', a: 'You will receive instant download access after successful payment.' },
                                    { q: 'Are these notes updated?', a: 'Yes, all our notes are regularly updated.' },
                                ].map((faq, i) => (
                                    <div key={i} className="card p-6">
                                        <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                                        <p className="text-muted-foreground">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Purchase Card */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <div className="mb-4">
                                <span className="badge-primary">{note.category?.name || 'Note'}</span>
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-4">{note.title}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold">{(note.averageRating || 0).toFixed(1)}</span>
                                </div>
                                <span className="text-muted-foreground">({note.totalReviews || 0} reviews)</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{note.downloadCount?.toLocaleString() || 0} downloads</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                {note.price === 0 ? (
                                    <span className="text-3xl font-bold text-accent">Free</span>
                                ) : (
                                    <>
                                        <span className="text-3xl font-bold text-foreground">
                                            ₹{note.discountPrice || note.price}
                                        </span>
                                        {note.discountPrice && (
                                            <>
                                                <span className="text-xl text-muted-foreground line-through">₹{note.price}</span>
                                                <span className="badge bg-red-100 text-red-600">
                                                    {discountPercentage}% OFF
                                                </span>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 mb-6">
                                {note.price === 0 ? (
                                    <button className="btn-primary w-full py-4 text-base shadow-xl shadow-blue-500/20">
                                        <Download className="w-5 h-5" />
                                        Download Now
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isInCart(note.id)}
                                            className="btn-primary w-full py-4 text-base shadow-xl shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            {isInCart(note.id) ? 'Added to Cart' : 'Add to Cart'}
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            className="btn-outline w-full py-4 text-base rounded-full border-2 hover:bg-indigo-50"
                                        >
                                            Buy Now
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center justify-center gap-6 mb-6 pb-6 border-b border-border">
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`flex items-center gap-2 text-sm ${isWishlisted ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    Wishlist
                                </button>
                                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                                    <Share2 className="w-5 h-5" />
                                    Share
                                </button>
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle className="w-5 h-5 text-accent" />
                                    <span>Instant download after purchase</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle className="w-5 h-5 text-accent" />
                                    <span>Lifetime access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Notes */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Related Notes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedNotes.map((relNote) => (
                            <Link
                                key={relNote.id}
                                href={`/notes/${relNote.slug}`}
                                className="card-hover overflow-hidden group block h-full bg-card rounded-2xl border border-border"
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                                    {relNote.thumbnailUrl ? (
                                        <img src={relNote.thumbnailUrl} alt={relNote.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen className="w-16 h-16 text-slate-300" />
                                        </div>
                                    )}
                                    {relNote.discountPrice && (
                                        <span className="absolute top-3 right-3 badge bg-red-500 text-white">
                                            {Math.round(((relNote.price - relNote.discountPrice) / relNote.price) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <span className="badge-primary text-xs mb-3">{relNote.category?.name || 'Note'}</span>
                                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                                        {relNote.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="font-medium text-sm">{(relNote.averageRating || 0).toFixed(1)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-foreground">
                                                ₹{relNote.discountPrice || relNote.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
                        <div className="p-4 border-b border-border flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                            <h3 className="font-bold text-lg">Preview: {note.title}</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-slate-100 dark:bg-slate-950 flex justify-center">
                            <div className="w-full max-w-2xl">
                                <PDFPreview
                                    previewUrl={note.previewUrl || note.fileUrl}
                                    previewPages={note.previewPages || 5}
                                    noteTitle={note.title}
                                    noteSlug={note.slug}
                                    price={note.price}
                                    discountPrice={note.discountPrice}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
