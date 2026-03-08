'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Send,
    ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();

    // Do not render the footer on any admin routes
    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="bg-slate-900 text-slate-300">


            {/* Main Footer */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md">
                                <img
                                    src="/images/logo.jpg"
                                    alt="NotesBundle"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-2xl font-bold text-white font-display leading-none">
                                Notes<span className="text-primary">Bundle</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 mb-6 max-w-sm">
                            Your one-stop destination for high-quality digital notes and study materials.
                            Ace your exams with our comprehensive collection.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/notes_bundle/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors text-white">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://t.me/+Wa6IyYA0Iz5iODFl" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors text-white">
                                <Send className="w-5 h-5" />
                            </a>
                            <a href="mailto:notesbundle@outlook.com" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors text-white">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Categories</h4>
                        <ul className="space-y-3">
                            {CATEGORIES.slice(0, 6).map((category) => (
                                <li key={category.slug}>
                                    <Link
                                        href={`/category/${category.slug}`}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/notes" className="text-slate-400 hover:text-white transition-colors">
                                    All Notes
                                </Link>
                            </li>
                            <li>
                                <Link href="/free" className="text-slate-400 hover:text-white transition-colors">
                                    Free Resources
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-slate-400 hover:text-white transition-colors">
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-primary mt-0.5" />
                                <span>notesbundle@outlook.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-primary mt-0.5" />
                                <span>*********</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                <span>Patna, Bihar, India</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm">
                            © {currentYear} NotesBundle. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-slate-500 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/refund" className="text-slate-500 hover:text-white transition-colors">
                                Refund Policy
                            </Link>
                            <Link href="/shipping-policy" className="text-slate-500 hover:text-white transition-colors">
                                Shipping Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
