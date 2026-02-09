import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return NextResponse.json(
            { error: 'Failed to fetch coupons' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
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
            code,
            description,
            discountType,
            discountValue,
            maxDiscount,
            minOrderValue,
            validFrom,
            validUntil,
            usageLimit,
            isActive,
        } = body;

        // Check if coupon code already exists
        const existing = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Coupon code already exists' },
                { status: 400 }
            );
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                description,
                discountType: discountType === 'percentage' ? 'PERCENTAGE' : 'FLAT',
                discountValue: parseFloat(discountValue),
                maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
                minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
                validFrom: validFrom ? new Date(validFrom) : new Date(),
                validUntil: validUntil ? new Date(validUntil) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                isActive: isActive !== false,
            },
        });

        return NextResponse.json(coupon, { status: 201 });
    } catch (error) {
        console.error('Error creating coupon:', error);
        return NextResponse.json(
            { error: 'Failed to create coupon' },
            { status: 500 }
        );
    }
}
