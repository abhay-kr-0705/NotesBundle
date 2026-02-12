import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const noteId = params.id;

        const note = await prisma.note.findUnique({
            where: { id: noteId },
            select: { previewUrl: true, fileUrl: true },
        });

        if (!note) {
            console.error(`Preview API: Note not found for ID ${noteId}`);
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        const url = note.previewUrl || note.fileUrl;

        if (!url) {
            console.error(`Preview API: No URL for note ${noteId}`);
            return NextResponse.json({ error: 'No preview file available' }, { status: 404 });
        }

        console.log(`Preview API: Redirecting to URL for ${noteId}: ${url}`);

        // Files uploaded with type 'upload' are publicly accessible.
        // Use the direct Cloudinary URL to avoid signed URL issues.
        return NextResponse.redirect(url);

    } catch (error: any) {
        console.error('Preview error:', error);
        return NextResponse.json({ error: 'Failed to generate preview', details: error.message || 'Unknown error' }, { status: 500 });
    }
}

