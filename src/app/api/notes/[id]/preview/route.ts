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
            select: {
                previewUrl: true,
                fileUrl: true,
                price: true,
                previewPages: true,
            },
        });

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        // For free notes, use the full file URL; for paid notes, use the preview URL
        // Prioritize previewUrl for paid notes if available
        let rawUrl = note.price === 0
            ? (note.fileUrl || note.previewUrl)
            : (note.previewUrl || note.fileUrl);

        if (!rawUrl) {
            return NextResponse.json({ error: 'No preview file available' }, { status: 404 });
        }

        console.log(`Preview API: Processing URL for note ${noteId}: ${rawUrl}`);

        // Check if it's a Cloudinary URL
        if (rawUrl.includes('cloudinary.com')) {
            const extracted = extractVersionAndPublicId(rawUrl);

            if (extracted) {
                const { version, publicId } = extracted;
                console.log(`Preview API: Extracted publicId: ${publicId} (version: ${version})`);

                // Determine type based on URL structure
                // If URL contains '/authenticated/', use 'authenticated'
                // If URL contains '/private/', use 'private'
                // Otherwise default to 'upload' but still sign it (Cloudinary "strict" mode handling)
                let type: 'authenticated' | 'upload' | 'private' = 'upload';
                if (rawUrl.includes('/authenticated/')) type = 'authenticated';
                else if (rawUrl.includes('/private/')) type = 'private';

                // Generate signed URL
                // We'll trust the helper to use the correct resource_type='raw' for PDFs usually
                const signedUrl = generateSignedUrl(publicId, 3600, type, version);

                console.log(`Preview API: Redirecting to signed URL for ${publicId}`);
                return NextResponse.redirect(signedUrl);
            } else {
                console.warn('Preview API: Failed to extract Cloudinary info, fallback to raw redirect');
            }
        }

        // Fallback or non-Cloudinary URL
        return NextResponse.redirect(rawUrl);

    } catch (error: any) {
        console.error('Preview error:', error);
        return NextResponse.json(
            { error: 'Failed to generate preview', details: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}

