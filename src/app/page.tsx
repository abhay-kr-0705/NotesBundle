import Link from 'next/link';
import {
    Search,
    ArrowRight,
    BookOpen,
    GraduationCap,
    Trophy,
    Code,
    FileText,
    Book,
    Star,
    Download,
    Users,
    CheckCircle,
    Sparkles
} from 'lucide-react';
import PopularTags from '@/components/seo/PopularTags';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

const categoryIcons: { [key: string]: any } = {
    'gate': GraduationCap,
    'engineering': BookOpen,
    'competitive': Trophy,
    'coding': Code,
    'pyqs': FileText,
    'handbooks': Book,
};

import { prisma } from '@/lib/prisma';

export default async function Home() {
    // Fetch categories
    const categories = await prisma.category.findMany({
        where: { parentId: null },
        include: {
            _count: {
                select: { notes: true }
            }
        },
        orderBy: { name: 'asc' },
    });

    // Fetch featured notes
    const featuredNotes = await prisma.note.findMany({
        where: {
            isFeatured: true,
            isPublished: true,
        },
        take: 4,
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // If no featured notes, fetch the latest ones
    if (featuredNotes.length === 0) {
        const latestNotes = await prisma.note.findMany({
            where: { isPublished: true },
            take: 4,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
        featuredNotes.push(...latestNotes);
    }

    const stats = [
        { icon: BookOpen, value: '500+', label: 'Study Materials' },
        { icon: Download, value: '50K+', label: 'Downloads' },
        { icon: Users, value: '10K+', label: 'Happy Students' },
        { icon: Star, value: '4.8', label: 'Average Rating' },
    ];

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-30"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

                <div className="container-custom relative z-10 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6 animate-fade-in">
                            <Sparkles className="w-4 h-4" />
                            Premium Quality Study Materials
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-5 animate-slide-up font-display">
                            Your Gateway to
                            <span className="text-gradient block mt-2">Academic Excellence</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Get high-quality digital notes for GATE, Engineering, Competitive Exams,
                            Coding, and more. Affordable study materials with instant access.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <form action="/search" className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    name="q"
                                    placeholder="Search for notes, subjects, exams..."
                                    className="w-full pl-14 pr-36 py-4 md:py-5 bg-white border border-border rounded-2xl shadow-soft text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2.5 md:py-3 px-6">
                                    Search
                                </button>
                            </form>
                        </div>

                        {/* Quick Tags */}
                        <div className="flex flex-wrap items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <span className="text-muted-foreground text-sm">Popular:</span>
                            <Link href="/search?q=gate" className="badge bg-white border border-border hover:border-primary hover:text-primary transition-colors">
                                GATE Notes
                            </Link>
                            <Link href="/search?q=beu" className="badge bg-white border border-border hover:border-primary hover:text-primary transition-colors">
                                BEU Semester Notes
                            </Link>
                            <Link href="/search?q=ssc" className="badge bg-white border border-border hover:border-primary hover:text-primary transition-colors">
                                SSC Preparation
                            </Link>
                            <Link href="/search?q=python" className="badge bg-white border border-border hover:border-primary hover:text-primary transition-colors">
                                Python Notes
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-10 bg-white border-y border-border">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Notes Section */}
            <section className="py-16 bg-gradient-subtle">
                <div className="container-custom">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                                Featured Notes
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Top-rated study materials loved by students
                            </p>
                        </div>
                        <Link href="/notes" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                            View All <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredNotes.map((note) => (
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
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                <span className="font-medium text-sm">{note.averageRating.toFixed(1)}</span>
                                            </div>
                                            <span className="text-muted-foreground text-sm">({note.totalReviews} reviews)</span>
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
                        ))}
                    </div>

                    <div className="text-center mt-8 md:hidden">
                        <Link href="/notes" className="btn-primary">
                            View All Notes <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                            Why Choose NotesBundle?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We provide the best study materials to help you succeed in your exams
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: CheckCircle,
                                title: 'Quality Content',
                                description: 'Expert-curated notes with comprehensive coverage of all topics',
                            },
                            {
                                icon: Download,
                                title: 'Instant Access',
                                description: 'Download immediately after purchase, no waiting required',
                            },
                            {
                                icon: Star,
                                title: 'Highly Rated',
                                description: 'Loved by thousands of students with 4.8+ average rating',
                            },
                            {
                                icon: Users,
                                title: 'Community Support',
                                description: 'Join a community of 10K+ students helping each other',
                            },
                        ].map((feature, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-5">
                                    <feature.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Browse by Category */}
            <section className="py-16 bg-gradient-subtle">
                <div className="container-custom">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                            Browse by Category
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Find the perfect study materials for your preparation needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, index) => {
                            const Icon = categoryIcons[category.slug] || BookOpen;
                            return (
                                <Link
                                    key={category.slug}
                                    href={`/category/${category.slug}`}
                                    className="card-hover p-6 group"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform">
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-3">
                                                {category.description}
                                            </p>
                                            <div className="flex items-center text-primary font-medium text-sm">
                                                {category._count?.notes || 0} notes
                                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                            What Students Say
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Real stories from students who achieved their goals
                        </p>
                    </div>

                    <div className="px-6">
                        <TestimonialsCarousel />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/grid-white.svg')] bg-center opacity-10"></div>
                <div className="container-custom relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of students who trust NotesBundle for their exam preparation
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup" className="btn bg-white text-primary hover:bg-slate-100 shadow-lg">
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/notes" className="btn border-2 border-white text-white hover:bg-white/10">
                            Browse All Notes
                        </Link>
                    </div>
                </div>
            </section>

            {/* Popular SEO Tags */}
            <PopularTags />
        </div>
    );
}
