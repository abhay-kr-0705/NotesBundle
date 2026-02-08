import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const minRating = searchParams.get('minRating');

        const where: any = {
            isPublished: true,
        };

        if (category) {
            where.category = {
                slug: category,
            };
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        if (minRating) {
            where.averageRating = {
                gte: parseFloat(minRating),
            };
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { has: search.toLowerCase() } },
            ];
        }

        const [notes, total] = await Promise.all([
            prisma.note.findMany({
                where,
                include: {
                    category: {
                        select: {
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.note.count({ where }),
        ]);

        return NextResponse.json({
            notes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
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
        } = body;

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const note = await prisma.note.create({
            data: {
                title,
                slug,
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
                language: language || 'English',
                pages: pages ? parseInt(pages) : null,
                previewPages: parseInt(previewPages) || 5,
                fileUrl,
                previewUrl,
                thumbnailUrl,
                isFeatured: isFeatured || false,
                isPublished: isPublished !== false,
            },
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        console.error('Error creating note:', error);
        return NextResponse.json(
            { error: 'Failed to create note' },
            { status: 500 }
        );
    }
}
