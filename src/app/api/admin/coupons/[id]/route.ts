import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PUT update coupon
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const coupon = await prisma.coupon.update({
            where: { id: params.id },
            data: {
                ...(code && { code: code.toUpperCase() }),
                description: description || null,
                ...(discountType && { discountType }),
                ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
                minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
                maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                ...(validFrom && { validFrom: new Date(validFrom) }),
                validUntil: validUntil ? new Date(validUntil) : null,
                ...(isActive !== undefined && { isActive }),
            },
        });

        return NextResponse.json(coupon);
    } catch (error: any) {
        console.error('Error updating coupon:', error);
        return NextResponse.json({ error: 'Failed to update coupon', details: error.message }, { status: 500 });
    }
}

// DELETE coupon
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.coupon.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting coupon:', error);
        return NextResponse.json({ error: 'Failed to delete coupon', details: error.message }, { status: 500 });
    }
}
