import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

        const coupon = await prisma.coupon.update({
            where: { id: params.id },
            data: {
                code: code?.toUpperCase(),
                description,
                discountType: discountType === 'percentage' ? 'PERCENTAGE' : 'FLAT',
                discountValue: discountValue ? parseFloat(discountValue) : undefined,
                maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
                minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
                validFrom: validFrom ? new Date(validFrom) : undefined,
                validUntil: validUntil ? new Date(validUntil) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                isActive,
            },
        });

        return NextResponse.json(coupon);
    } catch (error) {
        console.error('Error updating coupon:', error);
        return NextResponse.json(
            { error: 'Failed to update coupon' },
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

        await prisma.coupon.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return NextResponse.json(
            { error: 'Failed to delete coupon' },
            { status: 500 }
        );
    }
}
