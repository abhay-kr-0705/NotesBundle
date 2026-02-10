
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

        const body = await request.json();
        const { name, slug, description, parentId, icon } = body;

        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id: params.id },
        });

        if (!existingCategory) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Check if slug is taken by another category
        if (slug !== existingCategory.slug) {
            const slugTaken = await prisma.category.findUnique({
                where: { slug },
            });
            if (slugTaken) {
                return NextResponse.json(
                    { error: 'Category with this slug already exists' },
                    { status: 400 }
                );
            }
        }

        const updatedCategory = await prisma.category.update({
            where: { id: params.id },
            data: {
                name,
                slug,
                description,
                parentId: parentId || null,
                icon,
            },
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

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

        // Check if category has children or notes
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: {
                        notes: true,
                        children: true,
                    },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        if (category._count.notes > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category containing notes' },
                { status: 400 }
            );
        }

        if (category._count.children > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category containing subcategories' },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
