import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { name: true, phone: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, phone } = body;

        // Validation
        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        if (!phone || phone.trim().length === 0) {
            return NextResponse.json(
                { error: 'Phone number is required' },
                { status: 400 }
            );
        }

        // Optional: Check if the new phone number is already registered to another user
        const existingUserWithPhone = await prisma.user.findFirst({
            where: {
                phone: phone,
                NOT: { email: session.user.email }
            }
        });

        if (existingUserWithPhone) {
            return NextResponse.json(
                { error: 'This phone number is already associated with an account' },
                { status: 400 }
            );
        }

        // Update User
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name: name.trim(),
                phone: phone.trim()
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true
            }
        });

        return NextResponse.json(
            { message: 'Profile updated successfully', user: updatedUser },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile. Please try again.' },
            { status: 500 }
        );
    }
}
