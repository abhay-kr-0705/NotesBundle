'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Star,
    BookOpen,
    Download,
    ShoppingCart,
    Heart,
    Share2,
    ChevronRight,
    FileText,
    Clock,
    Languages,
    Eye,
    CheckCircle,
    User,
    MessageSquare
} from 'lucide-react';

// Sample note data (will be replaced with database query)
const noteData = {
    id: '1',
    title: 'Complete GATE CSE Notes 2024',
    slug: 'gate-cse-complete-notes-2024',
    description: 'Comprehensive notes covering all GATE CSE topics with solved examples and previous year questions. These notes are prepared by top educators and cover the complete syllabus for GATE Computer Science and Information Technology.',
    longDescription: `
    <h3>What's Included</h3>
    <ul>
      <li>Complete coverage of GATE CSE syllabus</li>
      <li>1000+ solved examples and practice problems</li>
      <li>Previous year questions with detailed solutions</li>
      <li>Topic-wise important formulas and concepts</li>
      <li>Quick revision notes for last-minute preparation</li>
    </ul>
    
    <h3>Topics Covered</h3>
    <ul>
      <li>Data Structures and Algorithms</li>
      <li>Database Management Systems</li>
      <li>Operating Systems</li>
      <li>Computer Networks</li>
      <li>Theory of Computation</li>
      <li>Compiler Design</li>
      <li>Computer Architecture</li>
      <li>Digital Logic</li>
      <li>Discrete Mathematics</li>
      <li>Engineering Mathematics</li>
    </ul>
  `,
    price: 299,
    discountPrice: 199,
    thumbnailUrl: null,
    category: 'GATE',
    categorySlug: 'gate',
    rating: 4.8,
    reviews: 234,
    pages: 450,
    downloadCount: 1520,
    language: 'English',
    format: 'PDF',
    fileSize: '45 MB',
    lastUpdated: '2024-01-15',
    previewPages: 10,
    isFree: false,
};

const sampleReviews = [
    {
        id: '1',
        user: 'Rahul Kumar',
        rating: 5,
        comment: 'Excellent notes! Very comprehensive and well-organized. Helped me a lot in my GATE preparation.',
        date: '2024-01-10',
        verified: true,
    },
    {
        id: '2',
        user: 'Priya Singh',
        rating: 4,
        comment: 'Good quality notes with clear explanations. Would recommend for GATE aspirants.',
        date: '2024-01-08',
        verified: true,
    },
    {
        id: '3',
        user: 'Amit Verma',
        rating: 5,
        comment: 'Best GATE notes I have ever used. The PYQs section is really helpful.',
        date: '2024-01-05',
        verified: false,
    },
];

const relatedNotes = [
    {
        id: '2',
        title: 'GATE ECE Notes 2024',
        slug: 'gate-ece-notes-2024',
        price: 249,
        discountPrice: null,
        rating: 4.7,
        category: 'GATE',
    },
    {
        id: '3',
        title: 'GATE Previous Year Papers',
        slug: 'gate-pyqs-all-years',
        price: 199,
        discountPrice: 149,
        rating: 4.9,
        category: 'PYQs',
    },
    {
        id: '4',
        title: 'Engineering Mathematics',
        slug: 'engineering-mathematics-gate',
        price: 149,
        discountPrice: null,
        rating: 4.6,
        category: 'Handbooks',
    },
];

export default function NoteDetailPage({ params }: { params: { slug: string } }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

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
                        <Link href={`/category/${noteData.categorySlug}`} className="hover:text-primary">{noteData.category}</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground line-clamp-1">{noteData.title}</span>
                    </nav>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Preview & Details */}
                    <div className="lg:col-span-2">
                        {/* Preview Image */}
                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                            <BookOpen className="w-24 h-24 text-slate-300" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <button className="btn bg-white text-foreground hover:bg-slate-100 shadow-lg">
                                    <Eye className="w-5 h-5" />
                                    Preview ({noteData.previewPages} pages)
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
                                <p className="text-lg text-muted-foreground mb-6">{noteData.description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="card p-4 text-center">
                                        <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <p className="font-semibold">{noteData.pages} Pages</p>
                                    </div>
                                    <div className="card p-4 text-center">
                                        <Languages className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <p className="font-semibold">{noteData.language}</p>
                                    </div>
                                    <div className="card p-4 text-center">
                                        <Download className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <p className="font-semibold">{noteData.fileSize}</p>
                                    </div>
                                    <div className="card p-4 text-center">
                                        <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <p className="font-semibold">Updated Recently</p>
                                    </div>
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: noteData.longDescription }} />
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div>
                                {/* Rating Summary */}
                                <div className="card p-6 mb-6">
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold text-foreground mb-2">{noteData.rating}</div>
                                            <div className="flex items-center gap-1 justify-center mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < Math.floor(noteData.rating)
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'text-slate-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{noteData.reviews} reviews</p>
                                        </div>
                                        <div className="flex-1">
                                            {[5, 4, 3, 2, 1].map((num) => (
                                                <div key={num} className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm w-3">{num}</span>
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-amber-400 rounded-full"
                                                            style={{ width: `${num === 5 ? 70 : num === 4 ? 20 : 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Reviews List */}
                                <div className="space-y-4">
                                    {sampleReviews.map((review) => (
                                        <div key={review.id} className="card p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                                    {review.user.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">{review.user}</span>
                                                        {review.verified && (
                                                            <span className="badge-accent text-xs">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Verified Purchase
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex items-center gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating
                                                                            ? 'fill-amber-400 text-amber-400'
                                                                            : 'text-slate-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">{review.date}</span>
                                                    </div>
                                                    <p className="text-muted-foreground">{review.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'faq' && (
                            <div className="space-y-4">
                                {[
                                    { q: 'How will I receive the notes after purchase?', a: 'You will receive instant download access after successful payment. The notes will also be available in your account dashboard.' },
                                    { q: 'Are these notes updated for the latest syllabus?', a: 'Yes, all our notes are regularly updated to match the latest exam pattern and syllabus.' },
                                    { q: 'Can I get a refund if I\'m not satisfied?', a: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied with the quality of our notes.' },
                                    { q: 'Is there any support available for doubts?', a: 'We have a community forum where you can ask questions and get help from other students and educators.' },
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
                                <span className="badge-primary">{noteData.category}</span>
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-4">{noteData.title}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold">{noteData.rating}</span>
                                </div>
                                <span className="text-muted-foreground">({noteData.reviews} reviews)</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{noteData.downloadCount.toLocaleString()} downloads</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                {noteData.isFree ? (
                                    <span className="text-3xl font-bold text-accent">Free</span>
                                ) : (
                                    <>
                                        <span className="text-3xl font-bold text-foreground">
                                            ₹{noteData.discountPrice || noteData.price}
                                        </span>
                                        {noteData.discountPrice && (
                                            <>
                                                <span className="text-xl text-muted-foreground line-through">₹{noteData.price}</span>
                                                <span className="badge bg-red-100 text-red-600">
                                                    {Math.round(((noteData.price - noteData.discountPrice) / noteData.price) * 100)}% OFF
                                                </span>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 mb-6">
                                <button className="btn-primary w-full py-3.5">
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                                <button className="btn-outline w-full py-3.5">
                                    Buy Now
                                </button>
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
                                    <span>Lifetime access to notes</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle className="w-5 h-5 text-accent" />
                                    <span>Free updates included</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle className="w-5 h-5 text-accent" />
                                    <span>7-day money-back guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Notes */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Related Notes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedNotes.map((note) => (
                            <Link
                                key={note.id}
                                href={`/notes/${note.slug}`}
                                className="card-hover overflow-hidden group"
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BookOpen className="w-16 h-16 text-slate-300" />
                                    </div>
                                    {note.discountPrice && (
                                        <span className="absolute top-3 right-3 badge bg-red-500 text-white">
                                            {Math.round(((note.price - note.discountPrice) / note.price) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <span className="badge-primary text-xs mb-3">{note.category}</span>
                                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {note.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="font-medium text-sm">{note.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-foreground">
                                                ₹{note.discountPrice || note.price}
                                            </span>
                                            {note.discountPrice && (
                                                <span className="text-sm text-muted-foreground line-through">₹{note.price}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
