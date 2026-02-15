import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { notes: true }
                },
                parent: true,
                children: true,
            },
            orderBy: [
                { order: 'asc' },
                { name: 'asc' },
            ],
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST create category
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, slug, description, parentId, icon } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Name and slug are required' },
                { status: 400 }
            );
        }

        // Check if slug exists
        const existing = await prisma.category.findUnique({
            where: { slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Category with this slug already exists' },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                parentId: parentId || null,
                icon,
                order: body.order ? parseInt(body.order) : 0,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
// PUT update category
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, slug, description, parentId, icon } = body;

        if (!id || !name || !slug) {
            return NextResponse.json(
                { error: 'ID, Name, and Slug are required' },
                { status: 400 }
            );
        }

        // Check if slug exists for OTHER categories
        const existing = await prisma.category.findFirst({
            where: {
                slug,
                NOT: { id }
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Category with this slug already exists' },
                { status: 400 }
            );
        }

        // Check for circular dependency if setting parent
        if (parentId) {
            if (parentId === id) {
                return NextResponse.json({ error: 'Cannot set category as its own parent' }, { status: 400 });
            }
            // Ideally we should check deeper cycles, but 1-level is minimum safety
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                parentId: parentId || null,
                icon,
                order: body.order ? parseInt(body.order) : 0,
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

// DELETE category
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }

        // Check for children or notes
        const categoryCallback = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { children: true, notes: true }
                }
            }
        });

        if (!categoryCallback) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        if (categoryCallback._count.children > 0) {
            return NextResponse.json({ error: 'Cannot delete category with subcategories. Delete them first.' }, { status: 400 });
        }

        if (categoryCallback._count.notes > 0) {
            return NextResponse.json({ error: 'Cannot delete category with associated notes. Reassign or delete notes first.' }, { status: 400 });
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
