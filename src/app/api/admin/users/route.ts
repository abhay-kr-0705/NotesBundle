import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session?.user?.role !== 'ADMIN') {
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
                emailVerified: true,
                orders: {
                    select: {
                        id: true,
                        finalAmount: true,
                    },
                },
            },
            orderBy: [
                { role: 'asc' }, // ADMIN comes before USER alphabetically
                { createdAt: 'desc' },
            ],
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
            isActive: true, // Placeholder
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

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session?.user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const data = await request.json();
        const { userId, role } = data;

        if (!userId || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (role !== 'USER' && role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        // Update user role
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        return NextResponse.json({
            message: 'User role updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        );
    }
}
