import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSignedUrl, extractPublicIdFromUrl } from '@/lib/cloudinary';

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
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        const url = note.previewUrl || note.fileUrl;

        if (!url) {
            return NextResponse.json({ error: 'No preview file available' }, { status: 404 });
        }

        const publicId = extractPublicIdFromUrl(url);

        if (!publicId) {
            // Fallback to original URL if extracting ID fails
            return NextResponse.redirect(url);
        }

        // Generate signed URL
        // We switch to 'authenticated' as 'upload' type with signature often fails for restricted folders
        const signedUrl = generateSignedUrl(publicId, 3600, 'authenticated');

        return NextResponse.redirect(signedUrl);

    } catch (error) {
        console.error('Preview error:', error);
        return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
    }
}
