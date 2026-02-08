'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    Search,
    Star,
    BookOpen,
    Filter,
    ChevronDown,
    X
} from 'lucide-react';

// Sample search results
const sampleResults = [
    {
        id: '1',
        title: 'Complete GATE CSE Notes 2024',
        slug: 'gate-cse-complete-notes-2024',
        description: 'Comprehensive notes covering all GATE CSE topics with solved examples',
        category: 'GATE',
        price: 299,
        discountPrice: 199,
        rating: 4.8,
        reviews: 234,
    },
    {
        id: '2',
        title: 'GATE Previous Year Questions',
        slug: 'gate-pyqs-all-years',
        description: 'All previous year GATE papers with solutions',
        category: 'PYQs',
        price: 199,
        discountPrice: 149,
        rating: 4.9,
        reviews: 189,
    },
    {
        id: '3',
        title: 'DSA Handwritten Notes',
        slug: 'dsa-handwritten-notes',
        description: 'Data Structures and Algorithms notes with diagrams',
        category: 'Coding',
        price: 0,
        discountPrice: null,
        rating: 4.7,
        reviews: 156,
    },
];

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(query);
    const [results, setResults] = useState(sampleResults);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        setSearchQuery(query);
        // TODO: Fetch actual search results based on query
    }, [query]);

    return (
        <div className="pt-20 md:pt-24 pb-16">
            {/* Search Header */}
            <div className="bg-gradient-subtle border-b border-border">
                <div className="container-custom py-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        {query ? `Search results for "${query}"` : 'Search Notes'}
                    </h1>

                    <div className="flex gap-4 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search notes, handbooks, PYQs..."
                                className="input pl-12 text-lg py-3"
                            />
                        </div>
                        <button className="btn-primary px-6">
                            <Search className="w-5 h-5" />
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`lg:w-64 ${isFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="card p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-foreground">Filters</h3>
                                <button
                                    onClick={() => setIsFiltersOpen(false)}
                                    className="lg:hidden p-1 rounded-lg hover:bg-secondary"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-foreground mb-3">Category</h4>
                                <div className="space-y-2">
                                    {['GATE', 'Engineering', 'Competitive', 'Coding', 'PYQs', 'Handbooks'].map((cat) => (
                                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                            <span className="text-muted-foreground">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-foreground mb-3">Price</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                        <span className="text-muted-foreground">Free</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                        <span className="text-muted-foreground">Under ₹100</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                        <span className="text-muted-foreground">₹100 - ₹300</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                        <span className="text-muted-foreground">Above ₹300</span>
                                    </label>
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <h4 className="font-medium text-foreground mb-3">Rating</h4>
                                <div className="space-y-2">
                                    {[4, 3, 2].map((rating) => (
                                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                            <div className="flex items-center gap-1">
                                                {[...Array(rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                ))}
                                                <span className="text-muted-foreground">& above</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button className="btn-outline w-full mt-6">
                                Clear Filters
                            </button>
                        </div>
                    </aside>

                    {/* Results */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-muted-foreground">
                                Showing <span className="font-medium text-foreground">{results.length}</span> results
                            </p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsFiltersOpen(true)}
                                    className="lg:hidden btn-secondary"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                </button>
                                <select className="input w-auto">
                                    <option>Most Relevant</option>
                                    <option>Newest</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Grid */}
                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.map((note) => (
                                    <Link
                                        key={note.id}
                                        href={`/notes/${note.slug}`}
                                        className="card-hover overflow-hidden group"
                                    >
                                        <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <BookOpen className="w-16 h-16 text-slate-300" />
                                            </div>
                                            {note.price === 0 && (
                                                <span className="absolute top-3 left-3 badge-free">Free</span>
                                            )}
                                            {note.discountPrice && (
                                                <span className="absolute top-3 right-3 badge bg-red-500 text-white">
                                                    {Math.round(((note.price - note.discountPrice) / note.price) * 100)}% OFF
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <span className="badge-primary text-xs mb-2">{note.category}</span>
                                            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {note.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{note.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <span className="font-medium text-sm">{note.rating}</span>
                                                    <span className="text-muted-foreground text-sm">({note.reviews})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {note.price === 0 ? (
                                                        <span className="text-lg font-bold text-accent">Free</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-lg font-bold text-foreground">
                                                                ₹{note.discountPrice || note.price}
                                                            </span>
                                                            {note.discountPrice && (
                                                                <span className="text-sm text-muted-foreground line-through">₹{note.price}</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                                <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
                                <Link href="/notes" className="btn-primary">
                                    Browse All Notes
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="pt-32 pb-16 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
