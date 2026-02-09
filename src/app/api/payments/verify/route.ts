import { NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/razorpay';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail, purchaseConfirmationEmail } from '@/lib/email';

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
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = body;

        // Verify payment signature
        const isValid = verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            // Update order status to failed
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'FAILED' },
            });

            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        // Update order status to paid
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'PAID',
                paymentId: razorpay_payment_id,
            },
            include: {
                items: {
                    include: {
                        note: true,
                    },
                },
                coupon: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Update coupon usage if used
        if (order.couponId) {
            await prisma.coupon.update({
                where: { id: order.couponId },
                data: {
                    usedCount: { increment: 1 },
                },
            });
        }

        // Increment download count for purchased notes
        await prisma.note.updateMany({
            where: {
                id: { in: order.items.map((item) => item.noteId) },
            },
            data: {
                downloadCount: { increment: 1 },
            },
        });

        // Update daily analytics
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.analytics.upsert({
            where: { date: today },
            update: {
                totalSales: { increment: 1 },
                revenue: { increment: order.finalAmount },
            },
            create: {
                date: today,
                totalSales: 1,
                revenue: order.finalAmount,
            },
        });

        // Send purchase confirmation email
        if (order.user.email) {
            const emailHtml = purchaseConfirmationEmail(
                order.user.name || 'Customer',
                order.id,
                order.items.map((item) => ({
                    title: item.note.title,
                    price: item.price,
                })),
                order.finalAmount
            );

            // Send email asynchronously (don't wait for it)
            sendEmail({
                to: order.user.email,
                subject: '🎉 Your NotesBundle Purchase Confirmation',
                html: emailHtml,
            }).catch((err) => console.error('Failed to send email:', err));
        }

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                items: order.items.map((item) => ({
                    title: item.note.title,
                    fileUrl: item.note.fileUrl,
                })),
            },
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}

