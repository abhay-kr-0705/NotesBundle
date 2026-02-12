import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

// GET all coupons
export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { orders: true } },
            },
        });
        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

// POST create coupon
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            usageLimit,
            validFrom,
            validUntil,
            isActive,
        } = body;

        if (!code || !discountType || discountValue === undefined) {
            return NextResponse.json({ error: 'Code, discount type, and discount value are required' }, { status: 400 });
        }

        // Check if code already exists
        const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
        if (existing) {
            return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                description: description || null,
                discountType,
                discountValue: parseFloat(discountValue),
                minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
                maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                validFrom: validFrom ? new Date(validFrom) : new Date(),
                validUntil: validUntil ? new Date(validUntil) : null,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(coupon, { status: 201 });
    } catch (error: any) {
        console.error('Error creating coupon:', error);
        return NextResponse.json({ error: 'Failed to create coupon', details: error.message }, { status: 500 });
    }
}
