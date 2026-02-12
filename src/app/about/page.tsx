import Link from 'next/link';
import {
    BookOpen,
    Users,
    Download,
    Shield,
    Clock,
    Award,
    GraduationCap,
    Target,
    Heart,
    Mail,
    ChevronRight,
    Star,
    Zap,
    CheckCircle
} from 'lucide-react';

export const metadata = {
    title: 'About Us - NotesBundle',
    description: 'Learn more about NotesBundle — your trusted source for high-quality, affordable study materials for GATE, university exams and competitive tests.',
};

export default function AboutPage() {
    const stats = [
        { icon: BookOpen, value: '500+', label: 'Study Materials' },
        { icon: Users, value: '10,000+', label: 'Happy Students' },
        { icon: Download, value: '50,000+', label: 'Downloads' },
        { icon: Star, value: '4.8/5', label: 'Average Rating' },
    ];

    const values = [
        {
            icon: Target,
            title: 'Quality First',
            description: 'Every set of notes is rigorously reviewed for accuracy, completeness, and clarity before being published on our platform.'
        },
        {
            icon: Heart,
            title: 'Student-Centric',
            description: 'We design our platform keeping students in mind — affordable pricing, instant access, and easy-to-understand materials.'
        },
        {
            icon: Shield,
            title: 'Trust & Reliability',
            description: 'Secure payments via Razorpay, instant digital delivery, and responsive customer support you can count on.'
        },
        {
            icon: Zap,
            title: 'Always Improving',
            description: 'We continuously update our library, add new subjects, and improve our platform based on student feedback.'
        },
    ];

    const features = [
        'Handwritten & digital notes curated by toppers',
        'Coverage for GATE, university, and competitive exams',
        'Instant PDF download after purchase',
        'Affordable student-friendly pricing',
        'Free resources available for many subjects',
        'Lifetime access to purchased materials',
    ];

    return (
        <div className="pt-20 md:pt-24 pb-16">
            {/* Hero Section */}
            <div className="bg-gradient-subtle border-b border-border">
                <div className="container-custom py-12 md:py-20">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground">About Us</span>
                    </nav>
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                            Empowering Students with
                            <span className="text-primary"> Quality Notes</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            NotesBundle is a dedicated platform built by students, for students.
                            We make high-quality study materials accessible and affordable, so you can focus
                            on what matters — acing your exams.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center p-6 bg-card rounded-2xl border border-border">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Story */}
            <div className="container-custom py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Story</h2>
                    </div>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            NotesBundle was born out of a simple observation — many talented students struggle
                            not because they lack ability, but because they lack access to good study materials.
                            Expensive coaching institutes and scattered online resources make exam preparation
                            unnecessarily stressful.
                        </p>
                        <p>
                            We started by collecting and organizing the best notes from top-performing students
                            across India. Today, NotesBundle hosts a growing collection of handwritten and digital
                            notes covering GATE preparation, engineering semester exams, competitive tests, and more.
                        </p>
                        <p>
                            Our goal is simple: make premium study content available at prices every student can afford,
                            with the convenience of instant digital access.
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Values */}
            <div className="bg-secondary/50 border-y border-border">
                <div className="container-custom py-12 md:py-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
                        What We Stand For
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {values.map((value) => (
                            <div key={value.title} className="bg-card p-6 rounded-2xl border border-border">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <value.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="container-custom py-12 md:py-16">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Award className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Why Choose NotesBundle?</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {features.map((feature) => (
                            <div key={feature} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                <span className="text-foreground text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA / Contact Section */}
            <div className="bg-gradient-subtle border-t border-border">
                <div className="container-custom py-12 md:py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-7 h-7 text-primary" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                            Have Questions?
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            We&apos;d love to hear from you. Whether you have a question about our notes,
                            pricing, or anything else — our team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="mailto:notesbundle@outlook.com"
                                className="btn-primary px-8 py-3 flex items-center gap-2"
                            >
                                <Mail className="w-5 h-5" />
                                notesbundle@outlook.com
                            </a>
                            <Link
                                href="/contact"
                                className="btn-secondary px-8 py-3"
                            >
                                Contact Page
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" />
                            We typically respond within 24 hours
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
