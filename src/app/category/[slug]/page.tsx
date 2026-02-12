import Link from 'next/link';
import {
    ChevronRight,
    BookOpen,
    Star,
    ArrowRight
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const category = await prisma.category.findUnique({
        where: { slug: params.slug },
    });

    if (!category) {
        return { title: 'Category Not Found' };
    }

    return {
        title: `${category.name} Notes & Study Material | Download PDF`,
        description: `${category.description || category.name}. Download high-quality ${category.name} notes, PYQs, and study materials.`,
        keywords: [
            category.name,
            `${category.name} notes`,
            `${category.name} pdf download`,
            `${category.name} study material`,
        ],
        openGraph: {
            title: `${category.name} Notes | NotesBundle`,
            description: category.description || `Browse ${category.name} study materials on NotesBundle`,
            type: 'website',
        },
    };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const category = await prisma.category.findUnique({
        where: { slug: params.slug },
        include: {
            children: {
                include: {
                    _count: { select: { notes: true } },
                },
                orderBy: { name: 'asc' },
            },
            _count: { select: { notes: true } },
        },
    });

    if (!category) {
        notFound();
    }

    // Fetch notes for this category
    const notes = await prisma.note.findMany({
        where: {
            categoryId: category.id,
            isPublished: true,
        },
        include: { category: true },
        orderBy: { downloadCount: 'desc' },
        take: 8,
    });

    return (
        <div className="pt-20 md:pt-24 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/5 via-white to-accent/5 border-b border-border">
                <div className="container-custom py-12">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/notes" className="hover:text-primary">Notes</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground">{category.name}</span>
                    </nav>

                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                            <BookOpen className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                {category.name}
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                {category.description || `Browse ${category.name} study materials`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-10">
                {/* Subcategories */}
                {category.children.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold text-foreground mb-6">Browse Subcategories</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {category.children.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={`/notes?category=${sub.slug}`}
                                    className="card p-4 text-center hover:border-primary hover:shadow-medium transition-all group"
                                >
                                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                        {sub.name}
                                    </p>
                                    {sub._count.notes > 0 && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {sub._count.notes} notes
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notes Grid */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-foreground">All {category.name} Notes</h2>
                        <Link href={`/notes?category=${params.slug}`} className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {notes.length === 0 ? (
                        <div className="text-center py-12 card">
                            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground">No notes yet</h3>
                            <p className="text-muted-foreground mt-2">Notes for this category will appear here soon.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {notes.map((note) => (
                                <Link
                                    key={note.id}
                                    href={`/notes/${note.slug}`}
                                    className="card-hover overflow-hidden group"
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
                                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {note.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {note.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                <span className="font-medium text-sm">{(note.averageRating ?? 0).toFixed(1)}</span>
                                                <span className="text-muted-foreground text-sm">({note.totalReviews ?? 0})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {note.price === 0 ? (
                                                    <span className="text-lg font-bold text-accent">Free</span>
                                                ) : (
                                                    <>
                                                        <span className="text-lg font-bold text-foreground">
                                                            ₹{note.discountPrice || note.price}
                                                        </span>
                                                        {note.discountPrice && note.discountPrice < note.price && (
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
                    )}
                </div>
            </div>
        </div>
    );
}
