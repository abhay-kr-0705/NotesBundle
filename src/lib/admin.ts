import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function getDashboardStats() {
    const [
        totalRevenue,
        totalOrders,
        totalUsers,
        totalNotes,
        recentOrders,
        topNotes,
        dailyOrders,
        dailyTrafficRaw
    ] = await Promise.all([
        // Total Revenue (Only PAID orders)
        prisma.order.aggregate({
            _sum: { finalAmount: true },
            where: { status: OrderStatus.PAID }
        }),
        // Total Orders
        prisma.order.count(),
        // Total Users
        prisma.user.count({ where: { role: 'USER' } }),
        // Total Notes
        prisma.note.count(),
        // Recent Orders
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        }),
        // Top Notes (by download count for now, or we could calculate revenue)
        prisma.note.findMany({
            take: 5,
            orderBy: { downloadCount: 'desc' },
            select: {
                id: true,
                title: true,
                viewCount: true,
                downloadCount: true,
                price: true,
                discountPrice: true,
            }
        }),
        // Daily Stats (Last 7 days) - requires raw query or grouping
        // For simplicity, we might fetch last 7 days orders and aggregate in JS
        prisma.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7))
                },
                status: OrderStatus.PAID
            },
            select: {
                createdAt: true,
                finalAmount: true
            }
        }),
        // Daily Traffic (Last 7 days)
        prisma.pageView.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7))
                }
            },
            select: { createdAt: true }
        })
    ]);

    // Aggregate Traffic
    const dailyTraffic = dailyTrafficRaw.reduce((acc: { [key: string]: number }, view) => {
        const date = new Date(view.createdAt).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    return {
        revenue: totalRevenue._sum.finalAmount || 0,
        orders: totalOrders,
        users: totalUsers,
        notes: totalNotes,
        recentOrders,
        topNotes,
        dailyRevenue: dailyOrders,
        dailyTraffic
    };
}

export async function getAnalyticsData() {
    // Similar aggregates for analytics page
    const [
        totalViews,
        totalDownloads,
        totalOrders, // For conversion rate
        totalUsers,  // For unique visitors approx
        topPages,
        trafficSources, // Might need to be mocked or fetched from Analytics table if populated
        dailyAnalyticsAnalyticsTable,
        dailyTrafficRaw
    ] = await Promise.all([
        prisma.pageView.count(),
        prisma.note.aggregate({ _sum: { downloadCount: true } }),
        prisma.order.count(),
        prisma.user.count(),
        prisma.note.findMany({
            take: 5,
            orderBy: { viewCount: 'desc' },
            select: {
                id: true,
                title: true, // we don't store path, so we use title/slug
                slug: true,
                viewCount: true,
                pageViews: {
                    select: { ipAddress: true } // to calc unique somewhat
                }
            }
        }),
        // Traffic sources (mocked for now as we don't strictly track referrer in a clean way yet)
        prisma.pageView.groupBy({
            by: ['referrer'],
            _count: { referrer: true },
            orderBy: { _count: { referrer: 'desc' } },
            take: 5
        }),
        // Daily analytics from Analytics table
        prisma.analytics.findMany({
            take: 7,
            orderBy: { date: 'desc' }
        }),
        // Daily Traffic for fallback
        prisma.pageView.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7))
                }
            },
            select: { createdAt: true }
        })
    ]);

    // If Analytics table is empty, construct dailyAnalytics from PageView
    let dailyAnalytics = dailyAnalyticsAnalyticsTable;
    if (dailyAnalytics.length === 0 && dailyTrafficRaw.length > 0) {
        const trafficMap = dailyTrafficRaw.reduce((acc: { [key: string]: number }, view) => {
            const date = new Date(view.createdAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        // Create last 7 days array
        dailyAnalytics = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            return {
                id: `dynamic-${dateStr}`,
                date: d,
                totalViews: trafficMap[dateStr] || 0,
                uniqueViews: 0,
                totalSales: 0,
                revenue: 0,
                createdAt: d,
                updatedAt: d
            };
        }).reverse(); // Most recent last? No, usually charts want chronological.
        // Array.from generates today first (offset 0). Reverse makes it chronological (oldest to newest) if we generated it that way.
        // Wait, the map needs to match.
    }

    return {
        views: totalViews,
        downloads: totalDownloads._sum.downloadCount || 0,
        orders: totalOrders,
        users: totalUsers,
        topPages: topPages.map(p => ({
            ...p,
            uniqueVisitors: new Set(p.pageViews.map(v => v.ipAddress)).size
        })),
        trafficSources,
        dailyAnalytics
    };
}
