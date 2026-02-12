
import Link from 'next/link';
import {
    Grid3X3,
    List,
    Star,
    BookOpen,
    ChevronRight,
} from 'lucide-react';
import NotesFilter from '@/components/NotesFilter';
import NotesToolbar from '@/components/NotesToolbar';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic'; // Force dynamic rendering for search params

export default async function NotesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Parse search params
    const categoryParam = searchParams.category;
    const selectedCategories = Array.isArray(categoryParam)
        ? categoryParam
        : categoryParam
            ? [categoryParam]
            : [];

    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const priceRange = typeof searchParams.price === 'string' ? searchParams.price : undefined;
    const minRating = typeof searchParams.rating === 'string' ? parseInt(searchParams.rating) : undefined;
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;
    const view = typeof searchParams.view === 'string' ? searchParams.view : 'grid';
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
    const limit = 12;

    // Fetch categories for filter
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { notes: true }
            }
        }
    });

    // Build where clause
    const where: Prisma.NoteWhereInput = {
        isPublished: true,
    };

    if (selectedCategories.length > 0) {
        where.category = {
            slug: { in: selectedCategories }
        };
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
        where.averageRating = { gte: minRating };
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
                orderBy = { averageRating: 'desc' };
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
                    <NotesFilter categories={categories} />

                    {/* Notes Grid */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <NotesToolbar totalNotes={totalNotes} currentSort={sort} currentView={view} />

                        {/* Grid / List */}
                        <div className={view === 'list'
                            ? 'flex flex-col gap-4'
                            : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                        }>
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
                                        className={view === 'list'
                                            ? 'card-hover overflow-hidden group flex bg-card rounded-2xl border border-border h-auto'
                                            : 'card-hover overflow-hidden group block h-full bg-card rounded-2xl border border-border'
                                        }
                                    >
                                        <div className={view === 'list'
                                            ? 'w-32 sm:w-44 shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden'
                                            : 'aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden'
                                        }>
                                            {note.thumbnailUrl ? (
                                                <img
                                                    src={note.thumbnailUrl}
                                                    alt={note.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <BookOpen className={view === 'list' ? 'w-10 h-10 text-slate-300' : 'w-16 h-16 text-slate-300'} />
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
                                        <div className={view === 'list' ? 'p-4 flex-1 flex flex-col justify-center min-w-0' : 'p-5'}>
                                            <span className="badge-primary text-xs mb-2 inline-block">{note.category?.name || 'Uncategorized'}</span>
                                            <h3 className={`font-semibold text-foreground group-hover:text-primary transition-colors ${view === 'list' ? 'line-clamp-1 mb-1' : 'line-clamp-2 mb-2 min-h-[3rem]'}`}>
                                                {note.title}
                                            </h3>
                                            {view !== 'list' && (
                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
                                                    {note.description}
                                                </p>
                                            )}
                                            <div className={`flex items-center gap-4 text-sm text-muted-foreground ${view === 'list' ? 'mb-1' : 'mb-3'}`}>
                                                <span>{note.pages || 0} pages</span>
                                                <span>•</span>
                                                <span>{note.downloadCount.toLocaleString()} downloads</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                        <span className="font-medium text-sm">{(note.averageRating ?? 0).toFixed(1)}</span>
                                                    </div>
                                                    <span className="text-muted-foreground text-sm">({note.totalReviews ?? 0})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {note.price === 0 ? (
                                                        <span className="text-lg font-bold text-accent">Free</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-base sm:text-lg font-bold text-foreground">
                                                                ₹{note.discountPrice || note.price}
                                                            </span>
                                                            {note.discountPrice !== null && note.discountPrice < note.price && (
                                                                <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{note.price}</span>
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
                        {totalNotes > limit && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                {page > 1 && (
                                    <Link
                                        href={`/notes?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])), page: String(page - 1) }).toString()}`}
                                        className="btn-ghost px-4 py-2"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {Array.from({ length: Math.min(Math.ceil(totalNotes / limit), 5) }, (_, i) => i + 1).map((p) => (
                                    <Link
                                        key={p}
                                        href={`/notes?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])), page: String(p) }).toString()}`}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold ${p === page
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-secondary text-muted-foreground'
                                            }`}
                                    >
                                        {p}
                                    </Link>
                                ))}
                                {page < Math.ceil(totalNotes / limit) && (
                                    <Link
                                        href={`/notes?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])), page: String(page + 1) }).toString()}`}
                                        className="btn-ghost px-4 py-2"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
