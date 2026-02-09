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

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export default async function NotesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Parse search params
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const priceRange = typeof searchParams.price === 'string' ? searchParams.price : undefined;
    const minRating = typeof searchParams.rating === 'string' ? parseInt(searchParams.rating) : undefined;
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
    const limit = 12;

    // Build where clause
    const where: Prisma.NoteWhereInput = {
        isPublished: true,
    };

    if (category) {
        where.category = { slug: category };
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (priceRange) {
        switch (priceRange) {
            case 'free':
                where.price = 0;
                break;
            case 'under-100':
                where.price = { gt: 0, lte: 100 };
                break;
            case '100-200':
                where.price = { gt: 100, lte: 200 };
                break;
            case 'above-200':
                where.price = { gt: 200 };
                break;
        }
    }

    if (minRating) {
        where.rating = { gte: minRating };
    }

    // Build order by
    let orderBy: Prisma.NoteOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort) {
        switch (sort) {
            case 'price-low':
                orderBy = { price: 'asc' };
                break;
            case 'price-high':
                orderBy = { price: 'desc' };
                break;
            case 'rating':
                orderBy = { rating: 'desc' };
                break;
            case 'popular':
                orderBy = { downloadCount: 'desc' };
                break;
        }
    }

    // Fetch data
    const notes = await prisma.note.findMany({
        where,
        orderBy,
        include: {
            category: true,
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const totalNotes = await prisma.note.count({ where });

    // Helper function to update query params
    // We'll need client-side component for interactivity, but for now we render server side
    // usage of sampleNotes will be replaced by 'notes'

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
                                Showing <span className="font-semibold text-foreground">{totalNotes}</span> notes
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
                            {notes.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <h3 className="text-lg font-medium text-foreground">No notes found</h3>
                                    <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
                                </div>
                            ) : (
                                notes.map((note) => (
                                    <Link
                                        key={note.id}
                                        href={`/notes/${note.slug}`}
                                        className="card-hover overflow-hidden group block h-full bg-card rounded-2xl border border-border"
                                    >
                                        <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                                            {note.thumbnailUrl ? (
                                                <img
                                                    src={note.thumbnailUrl}
                                                    alt={note.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <BookOpen className="w-16 h-16 text-slate-300" />
                                                </div>
                                            )}
                                            {note.price === 0 && (
                                                <span className="absolute top-3 left-3 badge-free">Free</span>
                                            )}
                                            {note.discountPrice && note.discountPrice < note.price && (
                                                <span className="absolute top-3 right-3 badge bg-red-500 text-white">
                                                    {Math.round(((note.price - note.discountPrice) / note.price) * 100)}% OFF
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <span className="badge-primary text-xs mb-3">{note.category?.name || 'Uncategorized'}</span>
                                            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                                                {note.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
                                                {note.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                                <span>{note.pages || 0} pages</span>
                                                <span>•</span>
                                                <span>{note.downloadCount.toLocaleString()} downloads</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                        <span className="font-medium text-sm">{note.rating.toFixed(1)}</span>
                                                    </div>
                                                    <span className="text-muted-foreground text-sm">({note.reviews || 0})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {note.price === 0 ? (
                                                        <span className="text-lg font-bold text-accent">Free</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-lg font-bold text-foreground">
                                                                ₹{note.discountPrice || note.price}
                                                            </span>
                                                            {note.discountPrice !== null && note.discountPrice < note.price && (
                                                                <span className="text-sm text-muted-foreground line-through">₹{note.price}</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
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
