import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { phone, newPassword } = await req.json();

        if (!phone || !newPassword) {
            return NextResponse.json(
                { error: 'Phone and new password are required' },
                { status: 400 }
            );
        }

        // Basic password strength validation
        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Clean phone number (removing +91 if necessary, depending on how it's stored in DB)
        // Usually, the Firebase auth requires full international number, but in our DB it might just be 10 digits.
        // Let's search loosely (using endsWith if needed) or just direct match.
        // During registration, we saved the raw phone.
        const cleanPhone = phone.replace('+91', '').trim();

        // Verify the user exists by phone
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: phone.trim() },
                    { phone: cleanPhone }
                ]
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'No account found with this phone number.' },
                { status: 404 }
            );
        }

        // Hash the new password
        const hashedPassword = await hash(newPassword, 12);

        // Update the user's password
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: 'Password reset successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Phone Reset Password Error:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again.' },
            { status: 500 }
        );
    }
}
