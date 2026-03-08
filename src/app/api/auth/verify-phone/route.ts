import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Mark the user's phone as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                phoneVerified: new Date(),
                // If the user verifies their phone first successfully, 
                // we'll implicitly consider the account activated and clear standard OTP flags.
                otp: null,
                otpExpiry: null
            },
        });

        return NextResponse.json(
            { message: 'Phone verified successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Phone verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed. Please try again.' },
            { status: 500 }
        );
    }
}
