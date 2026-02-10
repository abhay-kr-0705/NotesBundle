import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
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

        if (user.emailVerified) {
            return NextResponse.json(
                { message: 'Email already verified' },
                { status: 200 }
            );
        }

        if (!user.otp || user.otp !== otp) {
            return NextResponse.json(
                { error: 'Invalid OTP' },
                { status: 400 }
            );
        }

        if (!user.otpExpiry || new Date() > user.otpExpiry) {
            return NextResponse.json(
                { error: 'OTP has expired' },
                { status: 400 }
            );
        }

        // Verify user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                otp: null,
                otpExpiry: null,
            },
        });

        return NextResponse.json(
            { message: 'Email verified successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}
