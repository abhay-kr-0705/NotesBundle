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
    Bell,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';

import { AdminCategoryIcon } from '@/components/icons/AdminCategoryIcon';

const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Notes', href: '/admin/notes', icon: BookOpen },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Categories', href: '/admin/categories', icon: AdminCategoryIcon },
    { name: 'Coupons', href: '/admin/coupons', icon: Tags },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 pt-0">
            {/* Hide main navbar on admin */}
            <style jsx global>{`
        body > div > header { display: none !important; }
        body > div > footer { display: none !important; }
      `}</style>

            {/* Admin Header */}
            <header className={`fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-40 flex items-center justify-between px-4 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-secondary"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Desktop Sidebar Toggle */}


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
            <aside className={`fixed top-0 left-0 h-full bg-white border-r border-border z-50 transition-all duration-300 
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} 
                w-64`}
            >
                <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-border transition-all duration-300 overflow-hidden`}>
                    <Link href="/admin" className="flex items-center gap-2 min-w-max">
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className={`transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:hidden' : 'opacity-100'}`}>
                            <span className="font-bold text-foreground">NotesBundle</span>
                            <span className="block text-xs text-muted-foreground">Admin Panel</span>
                        </div>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-secondary">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-3 space-y-1 mt-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                title={isCollapsed ? link.name : ''}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                            >
                                <link.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed && !isActive ? 'group-hover:scale-110 transition-transform' : ''}`} />
                                <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                                    {link.name}
                                </span>

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                                        {link.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border space-y-2">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <PanelLeftOpen className="w-5 h-5 flex-shrink-0" /> : <PanelLeftClose className="w-5 h-5 flex-shrink-0" />}
                        <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                            Collapse Sidebar
                        </span>
                    </button>
                    <Link
                        href="/"
                        title={isCollapsed ? "Back to Site" : ""}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                            Back to Site
                        </span>
                    </Link>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className={`pt-16 min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

