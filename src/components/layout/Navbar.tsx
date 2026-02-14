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
    ChevronRight,
    BookOpen,
    GraduationCap,
    Trophy,
    Code,
    FileText,
    Book,
    LogOut,
    Settings,
    Heart,
    Minus,
    Plus
} from 'lucide-react';


import { useCartStore } from '@/lib/store';
import Logo from '@/components/Logo';

export default function Navbar() {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const cartItems = useCartStore((state) => state.items);

    // Mobile menu state for categories
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const toggleCategory = (categoryId: string) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryId);
        }
    };

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        // Fetch categories dynamically
        fetch('/api/admin/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            })
            .catch(err => console.error('Failed to fetch categories', err));

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
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {/* Categories Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsCategoryMenuOpen(true)}
                            onMouseLeave={() => setIsCategoryMenuOpen(false)}
                        >
                            <Link
                                href="/notes"
                                className="relative z-20 flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors py-2"
                            >
                                Categories
                                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                            </Link>

                            {isCategoryMenuOpen && (
                                <div className="absolute top-full left-0 z-20 pt-1 w-72 animate-slide-down">
                                    <div className="bg-white rounded-2xl shadow-strong border border-border p-2">
                                        <div className="max-h-[80vh] overflow-y-auto">
                                            {categories
                                                .filter(c => !c.parentId)
                                                .map((category) => {
                                                    const Icon = categoryIcons[category.slug] || BookOpen;
                                                    const subcategories = categories.filter(c => c.parentId === category.id);

                                                    return (
                                                        <div key={category.id} className="relative group/cat">
                                                            <Link
                                                                href={`/category/${category.slug}`}
                                                                onClick={() => setIsCategoryMenuOpen(false)}
                                                                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl transition-colors"
                                                            >
                                                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover/cat:bg-primary/20 transition-colors shrink-0">
                                                                    <Icon className="w-4 h-4 text-primary" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-foreground text-sm">{category.name}</p>
                                                                </div>
                                                                {subcategories.length > 0 && (
                                                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                                )}
                                                            </Link>

                                                            {/* Subcategories hover flyout */}
                                                            {subcategories.length > 0 && (
                                                                <div className="hidden group-hover/cat:block absolute left-full top-0 pl-2 z-30">
                                                                    <div className="bg-white rounded-2xl shadow-strong border border-border p-2 w-56">
                                                                        {subcategories.map(sub => (
                                                                            <Link
                                                                                key={sub.id}
                                                                                href={`/category/${sub.slug}`}
                                                                                onClick={() => setIsCategoryMenuOpen(false)}
                                                                                className="block px-4 py-2.5 text-sm text-slate-600 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                                                                            >
                                                                                {sub.name}
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/notes" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                            All Notes
                        </Link>
                        {session && (
                            <Link href="/my-notes" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                                My Notes
                            </Link>
                        )}
                        <Link href="/free-resources" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
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
                            {mounted && cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {session ? (
                            <div className="relative hidden sm:block">
                                {/* Backdrop */}
                                {isUserMenuOpen && (
                                    <div
                                        className="fixed inset-0 z-10 cursor-default"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />
                                )}

                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="relative z-20 flex items-center gap-2 p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {session.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute top-full right-0 z-20 mt-2 w-56 bg-white rounded-2xl shadow-strong border border-border p-2 animate-slide-down">
                                        <div className="px-4 py-3 border-b border-border">
                                            <p className="font-semibold text-foreground">{session.user?.name}</p>
                                            <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary transition-colors"
                                            >
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link
                                                href="/orders"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary transition-colors"
                                            >
                                                <span>My Orders</span>
                                            </Link>
                                            <Link
                                                href="/my-notes"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary transition-colors"
                                            >
                                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                                <span>My Notes</span>
                                            </Link>
                                            <Link
                                                href="/wishlist"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary transition-colors"
                                            >
                                                <Heart className="w-4 h-4 text-muted-foreground" />
                                                <span>Wishlist</span>
                                            </Link>
                                            {(session.user as any)?.role === 'ADMIN' && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary transition-colors text-primary font-medium"
                                                >
                                                    <Settings className="w-4 h-4" />
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
                                <Link href="/login" className="btn-ghost text-sm font-medium py-2.5 px-6 rounded-full hover:bg-slate-100">
                                    Log In
                                </Link>
                                <Link href="/signup" className="btn-primary text-sm font-medium py-2.5 px-6 shadow-md shadow-blue-500/20">
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

                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-border py-4 animate-slide-down max-h-[calc(100vh-4rem)] overflow-y-auto">
                        <div className="flex flex-col gap-2">
                            {categories
                                .filter(c => !c.parentId)
                                .map((category) => {
                                    const Icon = categoryIcons[category.slug] || BookOpen;
                                    const subcategories = categories.filter(c => c.parentId === category.id);

                                    return (
                                        <div key={category.id} className="border-b border-border/50 last:border-0">
                                            <div className="flex items-center justify-between px-4 py-3 hover:bg-secondary rounded-xl transition-colors cursor-pointer"
                                                onClick={() => toggleCategory(category.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                    <span className="font-medium">{category.name}</span>
                                                </div>
                                                {subcategories.length > 0 && (
                                                    <button className="p-1">
                                                        {expandedCategory === category.id ? (
                                                            <Minus className="w-4 h-4 text-muted-foreground" />
                                                        ) : (
                                                            <Plus className="w-4 h-4 text-muted-foreground" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Mobile Subcategories */}
                                            {subcategories.length > 0 && expandedCategory === category.id && (
                                                <div className="pl-12 pr-4 pb-2 space-y-2 animate-slide-down">
                                                    {subcategories.map(sub => (
                                                        <Link
                                                            key={sub.id}
                                                            href={`/category/${sub.slug}`}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block py-2 text-sm text-slate-600 hover:text-primary transition-colors border-l-2 border-border pl-3"
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            }
                            <hr className="my-2 border-border" />
                            <Link
                                href="/notes"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 font-medium hover:bg-secondary rounded-xl transition-colors"
                            >
                                All Notes
                            </Link>
                            <Link
                                href="/free-resources"
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
                                        className="flex items-center gap-3 px-4 py-3 font-medium hover:bg-secondary rounded-xl transition-colors"
                                    >
                                        <User className="w-5 h-5 text-muted-foreground" />
                                        My Profile
                                    </Link>
                                    <Link
                                        href="/orders"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 font-medium hover:bg-secondary rounded-xl transition-colors"
                                    >
                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                        My Orders
                                    </Link>
                                    <Link
                                        href="/my-notes"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 font-medium hover:bg-secondary rounded-xl transition-colors"
                                    >
                                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                                        My Notes
                                    </Link>
                                    <Link
                                        href="/wishlist"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 font-medium hover:bg-secondary rounded-xl transition-colors"
                                    >
                                        <Heart className="w-5 h-5 text-muted-foreground" />
                                        Wishlist
                                    </Link>
                                    <Link
                                        href="/cart"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 font-medium hover:bg-secondary rounded-xl transition-colors"
                                    >
                                        <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                                        Cart
                                        {mounted && cartItems.length > 0 && (
                                            <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {cartItems.length}
                                            </span>
                                        )}
                                    </Link>
                                    {(session.user as any)?.role === 'ADMIN' && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 font-medium text-primary hover:bg-secondary rounded-xl transition-colors"
                                        >
                                            <Settings className="w-5 h-5" />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left w-full"
                                    >
                                        <LogOut className="w-5 h-5" />
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
        </header >
    );
}
