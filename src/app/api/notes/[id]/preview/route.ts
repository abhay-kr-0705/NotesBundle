import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSignedUrl, extractVersionAndPublicId } from '@/lib/cloudinary';

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

        console.log(`Preview API: Found URL for ${noteId}: ${url}`);

        const fileDetails = extractVersionAndPublicId(url);

        if (!fileDetails) {
            // Fallback to original URL if extracting ID fails
            console.warn(`Preview API: Failed to extract details from URL: ${url}`);
            return NextResponse.redirect(url);
        }

        const { version, publicId } = fileDetails;

        // Generate signed URL
        // Reverting to 'upload' type as 'authenticated' returned 404 for existing files.
        // We rely on sign_url=true for access control.
        const signedUrl = generateSignedUrl(publicId, 3600, 'upload', version);
        console.log(`Preview API: Generated signed URL: ${signedUrl}`);

        return NextResponse.redirect(signedUrl);

    } catch (error: any) {
        console.error('Preview error:', error);
        return NextResponse.json({ error: 'Failed to generate preview', details: error.message || 'Unknown error' }, { status: 500 });
    }
}
