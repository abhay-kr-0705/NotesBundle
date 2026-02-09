import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { noteId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Please login to download' },
                { status: 401 }
            );
        }

        const { noteId } = params;

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get note
        const note = await prisma.note.findUnique({
            where: { id: noteId },
            select: {
                id: true,
                title: true,
                price: true,
                fileUrl: true,
            },
        });

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        // Free notes - allow direct download
        if (note.price === 0) {
            if (!note.fileUrl) {
                return NextResponse.json(
                    { error: 'File not available' },
                    { status: 404 }
                );
            }

            // Increment download count
            await prisma.note.update({
                where: { id: noteId },
                data: { downloadCount: { increment: 1 } },
            });

            return NextResponse.json({
                success: true,
                downloadUrl: note.fileUrl,
                title: note.title,
            });
        }

        // Paid notes - verify purchase
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                noteId,
                order: {
                    userId: user.id,
                    status: 'PAID',
                },
            },
        });

        if (!hasPurchased) {
            return NextResponse.json(
                { error: 'Please purchase this note to download' },
                { status: 403 }
            );
        }

        if (!note.fileUrl) {
            return NextResponse.json(
                { error: 'File not available' },
                { status: 404 }
            );
        }

        // Increment download count
        await prisma.note.update({
            where: { id: noteId },
            data: { downloadCount: { increment: 1 } },
        });

        return NextResponse.json({
            success: true,
            downloadUrl: note.fileUrl,
            title: note.title,
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: 'Failed to process download' },
            { status: 500 }
        );
    }
}
