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
            category, // This is the slug from frontend
            categoryId: directCategoryId, // Allow direct ID if provided
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

        // Validate required fields
        if (!title || !description) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
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

        if (!categoryId) {
            return NextResponse.json(
                { error: 'Category is required' },
                { status: 400 }
            );
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Check if slug already exists
        const existingNote = await prisma.note.findUnique({
            where: { slug },
        });

        const finalSlug = existingNote ? `${slug}-${Date.now()}` : slug;

        const note = await prisma.note.create({
            data: {
                title,
                slug: finalSlug,
                description,
                shortDescription: shortDescription || null,
                price: parseFloat(price) || 0,
                discountPrice: discountPrice ? parseFloat(discountPrice) : null,
                categoryId,
                tags: tags ? (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim().toLowerCase()) : tags) : [],
                examType: examType || null,
                university: university || null,
                semester: semester ? parseInt(semester) : null,
                branch: branch || null,
                subject: subject || null,
                language: language || 'English',
                pages: pages ? parseInt(pages) : null,
                previewPages: parseInt(previewPages) || 5,
                fileUrl: fileUrl || null,
                externalUrl: externalUrl || null,
                previewUrl: previewUrl || null,
                previewImages: previewImages || [],
                thumbnailUrl: thumbnailUrl || null,
                isFeatured: isFeatured || false,
                isPublished: isPublished !== false,
            },
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        console.error('Error creating note:', error);
        return NextResponse.json(
            { error: 'Failed to create note', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
