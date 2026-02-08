'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    Tags,
    Menu,
    X,
    LogOut,
    ChevronDown,
    Bell
} from 'lucide-react';

const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Notes', href: '/admin/notes', icon: BookOpen },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Coupons', href: '/admin/coupons', icon: Tags },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 pt-0">
            {/* Hide main navbar on admin */}
            <style jsx global>{`
        body > div > header { display: none !important; }
        body > div > footer { display: none !important; }
      `}</style>

            {/* Admin Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-40 flex items-center justify-between px-4 lg:pl-64">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-secondary"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="lg:hidden flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold">Admin</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-lg hover:bg-secondary relative">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            A
                        </div>
                        <span className="hidden sm:block font-medium">Admin</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 w-64 h-full bg-white border-r border-border z-50 transform transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-foreground">NotesBundle</span>
                            <span className="block text-xs text-muted-foreground">Admin Panel</span>
                        </div>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-secondary">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Back to Site
                    </Link>
                </div>
            </aside>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 min-h-screen">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
