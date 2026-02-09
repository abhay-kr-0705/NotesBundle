import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const note = await prisma.note.findUnique({
            where: { id: params.id },
            include: {
                category: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        return NextResponse.json(
            { error: 'Failed to fetch note' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            title,
            description,
            shortDescription,
            price,
            discountPrice,
            categoryId,
            tags,
            examType,
            university,
            semester,
            branch,
            subject,
            language,
            pages,
            previewPages,
            fileUrl,
            previewUrl,
            thumbnailUrl,
            isFeatured,
            isPublished,
            publicId, // New field for Cloudinary public ID
        } = body;

        // Verify note exists
        const existingNote = await prisma.note.findUnique({
            where: { id: params.id },
        });

        if (!existingNote) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        // If a new file is uploaded (fileUrl changed) and old one exists, delete the old one
        // Note: In a real app, you'd store the publicId in the database to delete it properly.
        // For now, we'll assume the frontend passes the old publicId if available or we just manage the new one.
        // Since we didn't store publicId in the Note model schema earlier, we might not be able to delete old files cleanly
        // unless we extract publicId from the URL or update the schema.
        // For this iteration, we'll proceed with updating the record.

        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const note = await prisma.note.update({
            where: { id: params.id },
            data: {
                title,
                slug: slug !== existingNote.slug ? slug : undefined,
                description,
                shortDescription,
                price: parseFloat(price) || 0,
                discountPrice: discountPrice ? parseFloat(discountPrice) : null,
                categoryId,
                tags: tags ? tags.split(',').map((t: string) => t.trim().toLowerCase()) : [],
                examType,
                university,
                semester: semester ? parseInt(semester) : null,
                branch,
                subject,
                language,
                pages: pages ? parseInt(pages) : null,
                previewPages: parseInt(previewPages) || 5,
                fileUrl,
                previewUrl,
                thumbnailUrl,
                isFeatured,
                isPublished,
            },
        });

        return NextResponse.json(note);
    } catch (error) {
        console.error('Error updating note:', error);
        return NextResponse.json(
            { error: 'Failed to update note' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const note = await prisma.note.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting note:', error);
        return NextResponse.json(
            { error: 'Failed to delete note' },
            { status: 500 }
        );
    }
}
