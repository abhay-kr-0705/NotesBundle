import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                // isActive is not in schema, assuming all user in DB are active or adding logic
                // The prompt's sample data had isActive. 
                // In schema we have 'emailVerified'.
                // Let's use that or just true for now if we don't have block status.
                emailVerified: true,
                orders: {
                    select: {
                        id: true,
                        finalAmount: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Transform data to match frontend expectations
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name || 'Unknown',
            email: user.email,
            phone: user.phone || 'N/A',
            role: user.role,
            totalOrders: user.orders.length,
            totalSpent: user.orders.reduce((sum, order) => sum + order.finalAmount, 0),
            createdAt: user.createdAt.toISOString().split('T')[0],
            isActive: true, // Placeholder until we add blocked status to schema
            isVerified: !!user.emailVerified,
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
