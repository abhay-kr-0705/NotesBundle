import Link from 'next/link';
import {
    Search,
    Grid3X3,
    List,
    Star,
    BookOpen,
    ChevronRight,
    SlidersHorizontal,
    Gift
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function FreeResourcesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Parse search params
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const minRating = typeof searchParams.rating === 'string' ? parseInt(searchParams.rating) : undefined;
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
    const limit = 12;

    // Build where clause - FILTER FOR FREE RESOURCES
    const where: Prisma.NoteWhereInput = {
        isPublished: true,
        price: 0, // ONLY FREE NOTES
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

    if (minRating) {
        where.averageRating = { gte: minRating };
    }

    // Build order by
    let orderBy: Prisma.NoteOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort) {
        switch (sort) {
            case 'rating':
                orderBy = { averageRating: 'desc' };
                break;
            case 'popular':
                orderBy = { downloadCount: 'desc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
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

    return (
        <div className="pt-20 md:pt-24 pb-16">
            {/* Header */}
            <div className="bg-gradient-subtle border-b border-border">
                <div className="container-custom py-10">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground">Free Resources</span>
                    </nav>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Gift className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Free Study Materials
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Access high-quality educational content without any cost. Enhance your learning with our free notes and resources.
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
                                        placeholder="Search free notes..."
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
                                Showing <span className="font-semibold text-foreground">{totalNotes}</span> free resources
                            </p>
                            <div className="flex items-center gap-4">
                                <select className="input py-2 px-4 w-auto text-sm">
                                    <option value="popular">Sort by: Popularity</option>
                                    <option value="newest">Newest</option>
                                    <option value="rating">Rating</option>
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
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground">No free resources found</h3>
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
                                            <span className="absolute top-3 left-3 badge-free">Free</span>
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
                                                        <span className="font-medium text-sm">{note.averageRating.toFixed(1)}</span>
                                                    </div>
                                                    <span className="text-muted-foreground text-sm">({note.totalReviews})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-accent">Free</span>
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
                            {/* Simple pagination logic for demo */}
                            <button className="btn-ghost px-4 py-2">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
