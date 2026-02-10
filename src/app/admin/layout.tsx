import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AdminSidebarLayout from './AdminSidebarLayout';
import { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect('/login');
    }

    // Direct DB check to ensure role is fresh (JWT might be stale)
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    // SUPER ADMIN SECURITY: Allow hardcoded super admin regardless of DB role
    const isSuperAdmin = session.user.email === 'notesbundle@outlook.com';

    if (!isSuperAdmin && (!user || user.role !== 'ADMIN')) {
        redirect('/');
    }

    return <AdminSidebarLayout>{children}</AdminSidebarLayout>;
}
