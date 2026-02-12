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
        const url = note.price === 0
            ? (note.fileUrl || note.previewUrl)
            : (note.previewUrl || note.fileUrl);

        if (!url) {
            return NextResponse.json({ error: 'No preview file available' }, { status: 404 });
        }

        // Proxy the PDF content through the API to avoid CORS/auth issues
        const pdfResponse = await fetch(url, {
            headers: {
                'Accept': 'application/pdf',
            },
        });

        if (!pdfResponse.ok) {
            console.error(`Preview API: Failed to fetch PDF from ${url}, status: ${pdfResponse.status}`);
            return NextResponse.json(
                { error: 'Failed to fetch preview PDF' },
                { status: 502 }
            );
        }

        const pdfBuffer = await pdfResponse.arrayBuffer();

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline',
                'Cache-Control': 'public, max-age=3600',
            },
        });

    } catch (error: any) {
        console.error('Preview error:', error);
        return NextResponse.json(
            { error: 'Failed to generate preview', details: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
