import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.otp || !user.otpExpiry) {
            return NextResponse.json({ error: 'No OTP found' }, { status: 400 });
        }

        if (user.otp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        if (new Date() > user.otpExpiry) {
            return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
        }

        // Verify OTP success - clear OTP fields
        // In a real auth flow, you might generate a session token here or mark emailVerified
        await prisma.user.update({
            where: { email },
            data: {
                otp: null,
                otpExpiry: null,
                emailVerified: new Date(), // Optional: mark email as verified
            },
        });

        return NextResponse.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
