import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import NoteClient from './NoteClient';

export const dynamic = 'force-dynamic';

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
