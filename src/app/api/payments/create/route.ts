import { NextResponse } from 'next/server';
import { createOrder, verifyPayment } from '@/lib/razorpay';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Please login to continue' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { noteIds, couponCode } = body;

        if (!noteIds || noteIds.length === 0) {
            return NextResponse.json(
                { error: 'No items selected' },
                { status: 400 }
            );
        }

        // Fetch notes
        const notes = await prisma.note.findMany({
            where: {
                id: { in: noteIds },
                isPublished: true,
            },
        });

        if (notes.length !== noteIds.length) {
            return NextResponse.json(
                { error: 'Some items are not available' },
                { status: 400 }
            );
        }

        // Calculate total
        let totalAmount = notes.reduce((sum, note) => {
            return sum + (note.discountPrice || note.price);
        }, 0);

        let discountAmount = 0;
        let coupon = null;

        // Apply coupon if provided
        if (couponCode) {
            coupon = await prisma.coupon.findFirst({
                where: {
                    code: couponCode.toUpperCase(),
                    isActive: true,
                    validFrom: { lte: new Date() },
                    OR: [
                        { validUntil: null },
                        { validUntil: { gte: new Date() } },
                    ],
                    OR: [
                        { usageLimit: null },
                        { usedCount: { lt: prisma.coupon.fields.usageLimit } },
                    ],
                },
            });

            if (coupon) {
                if (coupon.minOrderValue && totalAmount < coupon.minOrderValue) {
                    return NextResponse.json(
                        { error: `Minimum order value is ₹${coupon.minOrderValue}` },
                        { status: 400 }
                    );
                }

                if (coupon.discountType === 'PERCENTAGE') {
                    discountAmount = (totalAmount * coupon.discountValue) / 100;
                    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                        discountAmount = coupon.maxDiscount;
                    }
                } else {
                    discountAmount = coupon.discountValue;
                }
            }
        }

        const finalAmount = Math.max(totalAmount - discountAmount, 0);

        // Create Razorpay order
        const razorpayOrder = await createOrder(finalAmount);

        // Create order in database
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                totalAmount,
                discountAmount,
                finalAmount,
                status: 'PENDING',
                razorpayOrderId: razorpayOrder.id,
                couponId: coupon?.id,
                items: {
                    create: notes.map((note) => ({
                        noteId: note.id,
                        price: note.discountPrice || note.price,
                    })),
                },
            },
        });

        return NextResponse.json({
            orderId: order.id,
            razorpayOrderId: razorpayOrder.id,
            amount: finalAmount,
            currency: 'INR',
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
