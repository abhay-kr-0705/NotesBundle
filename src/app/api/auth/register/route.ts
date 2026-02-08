import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, password, interests } = body;

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // Validate password complexity
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character' },
                { status: 400 }
            );
        }

        // Check database connection first
        try {
            await prisma.$connect();
        } catch (dbError) {
            console.error('Database connection error:', dbError);
            return NextResponse.json(
                { error: 'Unable to connect to database. Please try again later.' },
                { status: 503 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                phone: phone || null,
                password: hashedPassword,
                interests: interests || [],
            },
        });

        return NextResponse.json(
            { message: 'Account created successfully!', userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            );
        }

        if (error.code === 'P1001' || error.code === 'P1002') {
            return NextResponse.json(
                { error: 'Unable to connect to database. Please try again later.' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
