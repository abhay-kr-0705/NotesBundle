import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mail';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // Update user with OTP
        await prisma.user.update({
            where: { email },
            data: {
                otp,
                otpExpiry,
            },
        });

        // Send OTP email
        // Only attempt to send if SMTP credentials are configured
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            const result = await sendEmail({
                to: email,
                subject: 'Your Login OTP - NotesBundle',
                html: `
                    <div style="font-family: sans-serif; max-w-md mx-auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <h2 style="color: #2563eb; text-align: center;">NotesBundle Login OTP</h2>
                        <p style="text-align: center; color: #475569;">Use the following OTP to complete your login:</p>
                        <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">${otp}</span>
                        </div>
                        <p style="text-align: center; font-size: 14px; color: #64748b;">This OTP is valid for 10 minutes.</p>
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
                            If you didn't request this, please ignore this email.
                        </div>
                    </div>
                `,
            });

            if (!result.success) {
                console.error('Failed to send OTP email:', result.error);
                return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
            }
        } else {
            console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
        }

        return NextResponse.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
