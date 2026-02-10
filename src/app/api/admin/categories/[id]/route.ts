import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// DELETE category
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;

        // Check if category has subcategories or notes
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                children: true,
                notes: true,
            },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        if (category.children.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with subcategories' },
                { status: 400 }
            );
        }

        if (category.notes.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with associated notes' },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}

// PUT update category
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;
        const body = await request.json();
        const { name, slug, description, parentId, icon } = body;

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                parentId: parentId || null,
                icon,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        );
    }
}
