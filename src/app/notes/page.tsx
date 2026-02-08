import Link from 'next/link';
import {
    Search,
    Filter,
    Grid3X3,
    List,
    Star,
    BookOpen,
    ChevronRight,
    SlidersHorizontal
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

// Sample notes data (will be replaced with database query)
const sampleNotes = [
    {
        id: '1',
        title: 'Complete GATE CSE Notes 2024',
        slug: 'gate-cse-complete-notes-2024',
        description: 'Comprehensive notes covering all GATE CSE topics with solved examples and previous year questions.',
        price: 299,
        discountPrice: 199,
        thumbnailUrl: null,
        category: 'GATE',
        categorySlug: 'gate',
        rating: 4.8,
        reviews: 234,
        pages: 450,
        downloadCount: 1520,
    },
    {
        id: '2',
        title: 'BEU 3rd Semester All Subjects',
        slug: 'beu-3rd-semester-all-subjects',
        description: 'Complete notes for all subjects of BEU 3rd semester CSE branch including DSA, DBMS, and more.',
        price: 199,
        discountPrice: null,
        thumbnailUrl: null,
        category: 'Engineering',
        categorySlug: 'engineering',
        rating: 4.6,
        reviews: 156,
        pages: 320,
        downloadCount: 890,
    },
    {
        id: '3',
        title: 'SSC CGL Complete Preparation',
        slug: 'ssc-cgl-complete-preparation',
        description: 'All-in-one study material for SSC CGL with PYQs, mock tests, and detailed explanations.',
        price: 0,
        discountPrice: null,
        thumbnailUrl: null,
        category: 'Competitive',
        categorySlug: 'competitive',
        rating: 4.9,
        reviews: 412,
        pages: 280,
        downloadCount: 2340,
    },
    {
        id: '4',
        title: 'Python Programming Handwritten Notes',
        slug: 'python-programming-handwritten-notes',
        description: 'Beautiful handwritten notes covering Python from basics to advanced with practical examples.',
        price: 149,
        discountPrice: 99,
        thumbnailUrl: null,
        category: 'Coding',
        categorySlug: 'coding',
        rating: 4.7,
        reviews: 189,
        pages: 180,
        downloadCount: 1100,
    },
    {
        id: '5',
        title: 'GATE ECE Previous Year Questions',
        slug: 'gate-ece-pyqs',
        description: 'Complete collection of GATE ECE PYQs from 2010-2024 with detailed solutions.',
        price: 249,
        discountPrice: 179,
        thumbnailUrl: null,
        category: 'PYQs',
        categorySlug: 'pyqs',
        rating: 4.8,
        reviews: 267,
        pages: 520,
        downloadCount: 1890,
    },
    {
        id: '6',
        title: 'Engineering Mathematics Handbook',
        slug: 'engineering-mathematics-handbook',
        description: 'Quick reference handbook for engineering mathematics with all formulas and concepts.',
        price: 99,
        discountPrice: null,
        thumbnailUrl: null,
        category: 'Handbooks',
        categorySlug: 'handbooks',
        rating: 4.5,
        reviews: 145,
        pages: 120,
        downloadCount: 780,
    },
    {
        id: '7',
        title: 'Railway NTPC Complete Guide',
        slug: 'railway-ntpc-complete-guide',
        description: 'Comprehensive preparation material for Railway NTPC exam with all subjects covered.',
        price: 0,
        discountPrice: null,
        thumbnailUrl: null,
        category: 'Competitive',
        categorySlug: 'competitive',
        rating: 4.7,
        reviews: 328,
        pages: 350,
        downloadCount: 2100,
    },
    {
        id: '8',
        title: 'Data Structures and Algorithms Notes',
        slug: 'dsa-notes-complete',
        description: 'In-depth notes on DSA with code examples in multiple languages and complexity analysis.',
        price: 199,
        discountPrice: 149,
        thumbnailUrl: null,
        category: 'Coding',
        categorySlug: 'coding',
        rating: 4.9,
        reviews: 456,
        pages: 280,
        downloadCount: 3200,
    },
];

export default function NotesPage() {
    return (
        <div className="pt-20 md:pt-24 pb-16">
            {/* Header */}
            <div className="bg-gradient-subtle border-b border-border">
                <div className="container-custom py-10">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground">All Notes</span>
                    </nav>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        All Study Materials
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Browse our complete collection of high-quality digital notes and study materials
                    </p>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-72 shrink-0">
                        <div className="card p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-semibold text-foreground flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5" />
                                    Filters
                                </h2>
                                <button className="text-sm text-primary hover:underline">Clear all</button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search notes..."
                                        className="input pl-10 py-2.5 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="font-medium text-foreground mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {CATEGORIES.map((category) => (
                                        <label key={category.slug} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                                {category.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="font-medium text-foreground mb-3">Price</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="price" className="w-4 h-4 border-border text-primary focus:ring-primary" />
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">All</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="price" className="w-4 h-4 border-border text-primary focus:ring-primary" />
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">Free</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="price" className="w-4 h-4 border-border text-primary focus:ring-primary" />
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">Under ₹100</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="price" className="w-4 h-4 border-border text-primary focus:ring-primary" />
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">₹100 - ₹200</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="price" className="w-4 h-4 border-border text-primary focus:ring-primary" />
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">Above ₹200</span>
                                    </label>
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <h3 className="font-medium text-foreground mb-3">Rating</h3>
                                <div className="space-y-2">
                                    {[4, 3, 2].map((rating) => (
                                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                            <span className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors">
                                                {rating}+ <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Notes Grid */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                            <p className="text-muted-foreground">
                                Showing <span className="font-semibold text-foreground">{sampleNotes.length}</span> notes
                            </p>
                            <div className="flex items-center gap-4">
                                <select className="input py-2 px-4 w-auto text-sm">
                                    <option>Sort by: Popularity</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Rating</option>
                                    <option>Newest</option>
                                </select>
                                <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                                    <button className="p-2 rounded-md bg-primary text-white">
                                        <Grid3X3 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-md text-muted-foreground hover:bg-secondary">
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sampleNotes.map((note) => (
                                <Link
                                    key={note.id}
                                    href={`/notes/${note.slug}`}
                                    className="card-hover overflow-hidden group"
                                >
                                    <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
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
                                        <span className="badge-primary text-xs mb-3">{note.category}</span>
                                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {note.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {note.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                            <span>{note.pages} pages</span>
                                            <span>•</span>
                                            <span>{note.downloadCount.toLocaleString()} downloads</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <span className="font-medium text-sm">{note.rating}</span>
                                                </div>
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

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-10">
                            <button className="btn-ghost px-4 py-2" disabled>Previous</button>
                            <button className="w-10 h-10 rounded-lg bg-primary text-white font-semibold">1</button>
                            <button className="w-10 h-10 rounded-lg hover:bg-secondary text-muted-foreground font-semibold">2</button>
                            <button className="w-10 h-10 rounded-lg hover:bg-secondary text-muted-foreground font-semibold">3</button>
                            <span className="px-2 text-muted-foreground">...</span>
                            <button className="w-10 h-10 rounded-lg hover:bg-secondary text-muted-foreground font-semibold">10</button>
                            <button className="btn-ghost px-4 py-2">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
