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
        // We try 'authenticated' first as that's likely the restriction
        // If the original upload was 'upload' but folder is restricted, 
        // access via signed URL with type 'upload' usually works if sign_url=true.
        // However, standard restricted access usually requires type='authenticated'.
        // Since we don't know the exact restriction type, we can default to 'upload' 
        // but signed, as the file was uploaded with type='upload' in the code.
        const signedUrl = generateSignedUrl(publicId, 3600, 'upload');

        return NextResponse.redirect(signedUrl);

    } catch (error) {
        console.error('Preview error:', error);
        return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
    }
}
