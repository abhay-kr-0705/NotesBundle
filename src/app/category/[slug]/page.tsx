import Link from 'next/link';
import {
    ChevronRight,
    BookOpen,
    GraduationCap,
    Trophy,
    Code,
    FileText,
    Book,
    Star,
    ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

const categoryIcons: { [key: string]: any } = {
    'gate': GraduationCap,
    'engineering': BookOpen,
    'competitive': Trophy,
    'coding': Code,
    'pyqs': FileText,
    'handbooks': Book,
};

// Sample notes for each category (will be replaced with database query)
const sampleNotes = [
    {
        id: '1',
        title: 'Complete GATE CSE Notes 2024',
        slug: 'gate-cse-complete-notes-2024',
        description: 'Comprehensive notes covering all GATE CSE topics',
        price: 299,
        discountPrice: 199,
        rating: 4.8,
        reviews: 234,
    },
    {
        id: '2',
        title: 'GATE ECE Complete Guide',
        slug: 'gate-ece-complete-guide',
        description: 'All subjects covered for GATE ECE preparation',
        price: 249,
        discountPrice: null,
        rating: 4.7,
        reviews: 189,
    },
    {
        id: '3',
        title: 'GATE Mechanical Engineering',
        slug: 'gate-mechanical-engineering',
        description: 'Complete ME notes with solved problems',
        price: 0,
        discountPrice: null,
        rating: 4.6,
        reviews: 156,
    },
    {
        id: '4',
        title: 'GATE Civil Engineering Notes',
        slug: 'gate-civil-engineering',
        description: 'Comprehensive CE preparation material',
        price: 199,
        discountPrice: 149,
        rating: 4.5,
        reviews: 123,
    },
];

import { Metadata } from 'next';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const category = CATEGORIES.find(c => c.slug === params.slug);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    // Determine relevant keywords based on category slug
    let relevantKeywords: string[] = [];

    if (params.slug.includes('gate') || params.slug.includes('engineering')) {
        relevantKeywords = [...SEO_KEYWORDS.engineering, ...SEO_KEYWORDS.biharSpecial];
    } else if (params.slug.includes('competitive') || params.slug.includes('ssc') || params.slug.includes('railway')) {
        relevantKeywords = [...SEO_KEYWORDS.generalCompetition, ...SEO_KEYWORDS.biharSpecial];
    } else if (params.slug.includes('coding')) {
        relevantKeywords = [...SEO_KEYWORDS.engineering];
    } else {
        relevantKeywords = [...SEO_KEYWORDS.studentSlang, ...SEO_KEYWORDS.buyerIntent];
    }

    // specific handling for BEU/Bihar
    if (params.slug === 'beu' || params.slug === 'bihar-police') {
        relevantKeywords = [...SEO_KEYWORDS.biharSpecial, ...relevantKeywords];
    }

    // Deduplicate
    relevantKeywords = Array.from(new Set(relevantKeywords));

    return {
        title: `${category.name} Notes & Study Material | Download PDF`,
        description: `${category.description}. Download high-quality ${category.name} notes, PYQs, and study materials. Updated for 2026 exams.`,
        keywords: [
            category.name,
            `${category.name} notes`,
            `${category.name} pdf download`,
            `${category.name} study material`,
            ...relevantKeywords.slice(0, 15) // Limit to top 15 relevant keywords to avoid stuffing
        ],
        openGraph: {
            title: `${category.name} Notes | NotesBundle`,
            description: category.description,
            type: 'website',
        }
    };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const category = CATEGORIES.find(c => c.slug === params.slug);
    const Icon = categoryIcons[params.slug] || BookOpen;

    if (!category) {
        return (
            <div className="pt-32 pb-16 text-center">
                <h1 className="text-2xl font-bold">Category not found</h1>
                <Link href="/" className="text-primary hover:underline mt-4 inline-block">
                    Go back home
                </Link>
            </div>
        );
    }

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
                            <Icon className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                {category.name}
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                {category.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-10">
                {/* Subcategories */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Browse Subcategories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {category.subcategories.map((sub) => (
                            <Link
                                key={sub.slug}
                                href={`/category/${params.slug}/${sub.slug}`}
                                className="card p-4 text-center hover:border-primary hover:shadow-medium transition-all group"
                            >
                                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                    {sub.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Notes Grid */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-foreground">All {category.name} Notes</h2>
                        <Link href={`/notes?category=${params.slug}`} className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {note.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {note.description}
                                    </p>
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
                </div>
            </div>
        </div>
    );
}
