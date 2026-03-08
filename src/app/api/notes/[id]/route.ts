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
            category, // This is the slug from frontend
            categoryId: directCategoryId,
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
            externalUrl,
            previewUrl,
            previewImages,
            thumbnailUrl,
            isFeatured,
            isPublished,
        } = body;

        // Verify note exists
        const existingNote = await prisma.note.findUnique({
            where: { id: params.id },
        });

        if (!existingNote) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        // Get categoryId - either from direct ID or by looking up slug
        let categoryId = directCategoryId;
        if (!categoryId && category) {
            const categoryRecord = await prisma.category.findUnique({
                where: { slug: category },
            });
            if (!categoryRecord) {
                return NextResponse.json(
                    { error: `Category '${category}' not found` },
                    { status: 400 }
                );
            }
            categoryId = categoryRecord.id;
        }

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
                shortDescription: shortDescription || null,
                price: parseFloat(price) || 0,
                discountPrice: discountPrice ? parseFloat(discountPrice) : null,
                categoryId: categoryId || undefined,
                tags: tags ? (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim().toLowerCase()) : tags) : [],
                examType: examType || null,
                university: university || null,
                semester: semester ? parseInt(semester) : null,
                branch: branch || null,
                subject: subject || null,
                language: language || 'English',
                pages: pages ? parseInt(pages) : null,
                previewPages: parseInt(previewPages) || 5,
                fileUrl: fileUrl || undefined,
                externalUrl: externalUrl || undefined,
                previewUrl: previewUrl || undefined,
                previewImages: previewImages || undefined,
                thumbnailUrl: thumbnailUrl || null,
                isFeatured,
                isPublished,
            },
        });

        return NextResponse.json(note);
    } catch (error) {
        console.error('Error updating note:', error);
        return NextResponse.json(
            { error: 'Failed to update note', details: error instanceof Error ? error.message : 'Unknown error' },
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

        // Delete related order items to prevent foreign key constraint errors
        await prisma.orderItem.deleteMany({
            where: { noteId: params.id },
        });

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
