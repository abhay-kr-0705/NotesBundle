import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import NoteClient from './NoteClient';

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const note = await prisma.note.findUnique({
        where: { slug: params.slug },
        include: { category: true }
    });

    if (!note) {
        return { title: 'Note Not Found' };
    }

    // Determine keywords based on category
    let categoryKeywords: string[] = [];
    const catSlug = note.category?.slug || '';

    if (catSlug.includes('gate') || catSlug.includes('engineering')) {
        categoryKeywords = [...SEO_KEYWORDS.engineering];
    } else if (catSlug.includes('competitive') || catSlug.includes('ssc')) {
        categoryKeywords = [...SEO_KEYWORDS.generalCompetition];
    } else {
        categoryKeywords = [...SEO_KEYWORDS.studentSlang]; // Default fallback
    }

    return {
        title: `${note.title} | Download PDF`,
        description: note.description.substring(0, 160),
        keywords: [
            note.title,
            'download pdf',
            'study notes',
            ...(note.category?.name ? [note.category.name] : []),
            ...categoryKeywords.slice(0, 10)
        ]
    };
}

export default async function NotePage({ params }: { params: { slug: string } }) {
    const note = await prisma.note.findUnique({
        where: {
            slug: params.slug,
        },
        include: {
            category: true,
        },
    });

    if (!note) {
        notFound();
    }

    // Fetch related notes (same category, excluding current)
    const relatedNotes = await prisma.note.findMany({
        where: {
            categoryId: note.categoryId,
            id: { not: note.id },
            isPublished: true,
        },
        take: 3,
        include: {
            category: true,
        },
        orderBy: {
            downloadCount: 'desc',
        },
    });

    return <NoteClient note={note} relatedNotes={relatedNotes} />;
}
