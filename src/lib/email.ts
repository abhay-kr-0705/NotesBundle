import nodemailer from 'nodemailer';

// Email configuration
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

console.log('Email Config Check:', {
    userPresent: !!smtpUser,
    passPresent: !!smtpPass,
    host: process.env.SMTP_HOST,
    userLength: smtpUser?.length
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"NotesBundle" <noreply@notesbundle.com>',
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
}

// Email Templates
export function purchaseConfirmationEmail(
    userName: string,
    orderId: string,
    items: { title: string; price: number }[],
    totalAmount: number
): string {
    const itemsList = items
        .map(
            (item) =>
                `<tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.title}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.price}</td>
                </tr>`
        )
        .join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Confirmation</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 Purchase Successful!</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
                <p style="color: #334155; font-size: 16px; margin-bottom: 24px;">
                    Hi <strong>${userName}</strong>,
                </p>
                <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
                    Thank you for your purchase! Your order has been confirmed and your notes are ready to download.
                </p>
                
                <div style="background-color: #f1f5f9; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                    <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">Order ID</p>
                    <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">${orderId}</p>
                </div>
                
                <!-- Order Items -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                    <thead>
                        <tr style="background-color: #f8fafc;">
                            <th style="padding: 12px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">Item</th>
                            <th style="padding: 12px; text-align: right; color: #64748b; font-size: 12px; text-transform: uppercase;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsList}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td style="padding: 12px; font-weight: 600; color: #1e293b;">Total</td>
                            <td style="padding: 12px; font-weight: 600; color: #1e293b; text-align: right;">₹${totalAmount}</td>
                        </tr>
                    </tfoot>
                </table>
                
                <!-- CTA Button -->
                <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/profile" 
                       style="display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px;">
                        Download Your Notes
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    Need help? Contact us at <a href="mailto:notesbundle@outlook.com" style="color: #2563eb;">notesbundle@outlook.com</a>
                </p>
                <p style="color: #cbd5e1; font-size: 11px; margin: 8px 0 0 0;">
                    © ${new Date().getFullYear()} NotesBundle. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export function downloadLinkEmail(
    userName: string,
    noteTitle: string,
    downloadUrl: string
): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Download Link</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📚 Your Download is Ready!</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
                <p style="color: #334155; font-size: 16px; margin-bottom: 24px;">
                    Hi <strong>${userName}</strong>,
                </p>
                <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
                    Your download link for "<strong>${noteTitle}</strong>" is ready. Click the button below to download your notes.
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${downloadUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px;">
                        ⬇️ Download Now
                    </a>
                </div>
                
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                    This link will expire in 24 hours. You can always access your purchases from your profile.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #cbd5e1; font-size: 11px; margin: 0;">
                    © ${new Date().getFullYear()} NotesBundle. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export function sendVerificationEmail(
    email: string,
    otp: string
): Promise<boolean> {
    const otpDigits = otp.split('').map(d => `
        <td style="padding: 0 4px;">
            <div style="width: 44px; height: 52px; background-color: #f1f5f9; border: 2px solid #e2e8f0; border-radius: 10px; text-align: center; line-height: 52px; font-size: 26px; font-weight: 700; color: #1e293b; font-family: 'Courier New', monospace;">
                ${d}
            </div>
        </td>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email - NotesBundle</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0;">
        <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); width: 48px; height: 48px; border-radius: 12px; text-align: center; line-height: 48px; font-size: 24px; color: white; font-weight: bold;">N</div>
                <div style="margin-top: 12px; font-size: 22px; font-weight: 700; color: #0f172a;">
                    Notes<span style="color: #2563eb;">Bundle</span>
                </div>
            </div>

            <!-- Main Card -->
            <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
                <!-- Gradient Banner -->
                <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 28px 24px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 8px;">✉️</div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Email Verification</h1>
                    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">One more step to complete your registration</p>
                </div>

                <!-- Body -->
                <div style="padding: 32px 28px;">
                    <p style="color: #334155; font-size: 15px; margin: 0 0 8px; line-height: 1.6;">
                        Hi there! 👋
                    </p>
                    <p style="color: #334155; font-size: 15px; margin: 0 0 24px; line-height: 1.6;">
                        Welcome to <strong>NotesBundle</strong>! Use the verification code below to confirm your email address:
                    </p>

                    <!-- OTP Code -->
                    <div style="text-align: center; margin: 28px 0;">
                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                            <tr>${otpDigits}</tr>
                        </table>
                    </div>

                    <!-- Expiry Notice -->
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;">
                        <p style="color: #92400e; font-size: 13px; margin: 0; font-weight: 500;">
                            ⏰ This code expires in <strong>10 minutes</strong>
                        </p>
                    </div>

                    <!-- Security Note -->
                    <div style="background-color: #f8fafc; border-radius: 10px; padding: 16px; border: 1px solid #e2e8f0;">
                        <p style="color: #475569; font-size: 13px; margin: 0 0 4px; font-weight: 600;">🔒 Security Note</p>
                        <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
                            If you did not create an account on NotesBundle, please ignore this email. Never share your OTP with anyone.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 24px 0 0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px;">
                    This is an automated message from NotesBundle. Please do not reply.
                </p>
                <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                    © ${new Date().getFullYear()} NotesBundle. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    return sendEmail({
        to: email,
        subject: '🔐 Your NotesBundle Verification Code',
        html,
    });
}

export function sendPasswordResetEmail(
    email: string,
    otp: string
): Promise<boolean> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Reset your password</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Reset Password</h1>
            </div>
            <div style="padding: 32px 24px;">
                <p style="color: #334155; font-size: 16px; margin-bottom: 24px;">
                    We received a request to reset your password. Use the OTP below to proceed:
                </p>
                <div style="background-color: #f1f5f9; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
                    <span style="font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #1e293b;">${otp}</span>
                </div>
                <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
                    This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    return sendEmail({
        to: email,
        subject: 'Reset your password - NotesBundle',
        html,
    });
}
