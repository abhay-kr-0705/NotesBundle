import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Fetch analytics summary (admin only)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get page views
        const pageViews = await prisma.pageView.count({
            where: {
                createdAt: { gte: startDate },
            },
        });

        // Get unique visitors (by IP)
        const uniqueVisitors = await prisma.pageView.groupBy({
            by: ['ipAddress'],
            where: {
                createdAt: { gte: startDate },
                ipAddress: { not: null },
            },
        });

        // Get total sales and revenue
        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
                status: 'PAID',
            },
            select: {
                finalAmount: true,
            },
        });

        const totalSales = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);

        // Get popular notes
        const popularNotes = await prisma.note.findMany({
            where: { isPublished: true },
            orderBy: { viewCount: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                viewCount: true,
                downloadCount: true,
            },
        });

        // Daily views for chart
        const dailyViews = await prisma.pageView.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: { gte: startDate },
            },
            _count: true,
        });

        return NextResponse.json({
            pageViews,
            uniqueVisitors: uniqueVisitors.length,
            totalSales,
            totalRevenue,
            popularNotes,
            dailyViews,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}

// POST - Record a page view
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { noteId } = body;

        if (!noteId) {
            return NextResponse.json({ error: 'Note ID required' }, { status: 400 });
        }

        // Get client info
        const ipAddress = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || '';
        const referrer = request.headers.get('referer') || '';

        // Record page view
        await prisma.pageView.create({
            data: {
                noteId,
                ipAddress: ipAddress.split(',')[0].trim(),
                userAgent,
                referrer,
            },
        });

        // Increment view count on note
        await prisma.note.update({
            where: { id: noteId },
            data: { viewCount: { increment: 1 } },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error recording page view:', error);
        return NextResponse.json(
            { error: 'Failed to record page view' },
            { status: 500 }
        );
    }
}
