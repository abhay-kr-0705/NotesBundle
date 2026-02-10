import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

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
            // Return success even if user doesn't exist to prevent enumeration
            return NextResponse.json(
                { message: 'If an account exists, an OTP has been sent.' },
                { status: 200 }
            );
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to user record
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otp,
                otpExpiry,
            },
        });

        // Send email
        await sendPasswordResetEmail(user.email, otp);

        return NextResponse.json(
            { message: 'If an account exists, an OTP has been sent.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
