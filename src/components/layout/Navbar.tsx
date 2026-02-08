'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
    Menu,
    X,
    Search,
    ShoppingCart,
    User,
    ChevronDown,
    BookOpen,
    GraduationCap,
    Trophy,
    Code,
    FileText,
    Book,
    LogOut,
    Settings,
    Heart
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export default function Navbar() {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categoryIcons: { [key: string]: any } = {
        'gate': GraduationCap,
        'engineering': BookOpen,
        'competitive': Trophy,
        'coding': Code,
        'pyqs': FileText,
        'handbooks': Book,
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-soft'
                    : 'bg-white'
                }`}
        >
            <nav className="container-custom">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-foreground font-display">
                            Notes<span className="text-primary">Bundle</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {/* Categories Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                                onBlur={() => setTimeout(() => setIsCategoryMenuOpen(false), 200)}
                                className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors"
                            >
                                Categories
                                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCategoryMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-strong border border-border p-2 animate-slide-down">
                                    {CATEGORIES.map((category) => {
                                        const Icon = categoryIcons[category.slug] || BookOpen;
                                        return (
                                            <Link
                                                key={category.slug}
                                                href={`/category/${category.slug}`}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors group"
                                            >
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{category.name}</p>
                                                    <p className="text-xs text-muted-foreground">{category.subcategories.length} subcategories</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <Link href="/notes" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                            All Notes
                        </Link>
                        <Link href="/free" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                            Free Resources
                        </Link>
                        <Link href="/about" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                            About
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <Link
                            href="/search"
                            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </Link>

                        {/* Wishlist */}
                        {session && (
                            <Link
                                href="/wishlist"
                                className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors hidden sm:flex"
                            >
                                <Heart className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        {/* User Menu */}
                        {session ? (
                            <div className="relative hidden sm:block">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {session.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-strong border border-border p-2 animate-slide-down">
                                        <div className="px-4 py-3 border-b border-border">
                                            <p className="font-semibold text-foreground">{session.user?.name}</p>
                                            <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary transition-colors"
                                            >
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link
                                                href="/orders"
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary transition-colors"
                                            >
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span>My Orders</span>
                                            </Link>
                                            <Link
                                                href="/wishlist"
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary transition-colors"
                                            >
                                                <Heart className="w-4 h-4 text-muted-foreground" />
                                                <span>Wishlist</span>
                                            </Link>
                                            {session.user?.role === 'ADMIN' && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary transition-colors"
                                                >
                                                    <Settings className="w-4 h-4 text-muted-foreground" />
                                                    <span>Admin Panel</span>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="border-t border-border pt-2">
                                            <button
                                                onClick={() => signOut()}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors w-full"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link href="/login" className="btn-ghost text-sm py-2 px-4">
                                    Log In
                                </Link>
                                <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2.5 rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-border py-4 animate-slide-down">
                        <div className="flex flex-col gap-2">
                            {CATEGORIES.map((category) => {
                                const Icon = categoryIcons[category.slug] || BookOpen;
                                return (
                                    <Link
                                        key={category.slug}
                                        href={`/category/${category.slug}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors"
                                    >
                                        <Icon className="w-5 h-5 text-primary" />
                                        <span className="font-medium">{category.name}</span>
                                    </Link>
                                );
                            })}
                            <hr className="my-2 border-border" />
                            <Link
                                href="/notes"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 font-medium hover:bg-secondary rounded-xl transition-colors"
                            >
                                All Notes
                            </Link>
                            <Link
                                href="/free"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 font-medium hover:bg-secondary rounded-xl transition-colors"
                            >
                                Free Resources
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 font-medium hover:bg-secondary rounded-xl transition-colors"
                            >
                                About
                            </Link>
                            <hr className="my-2 border-border" />
                            {session ? (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-4 py-3 font-medium hover:bg-secondary rounded-xl transition-colors"
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="px-4 py-3 font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-2 px-4 py-2">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary flex-1 text-center">
                                        Log In
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary flex-1 text-center">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
