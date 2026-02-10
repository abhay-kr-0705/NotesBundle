import Link from 'next/link';
import {
    BookOpen,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Newsletter Section */}
            <div className="border-b border-slate-800">
                <div className="container-custom py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Stay Updated!</h3>
                            <p className="text-slate-400">Get notified about new notes and exclusive offers.</p>
                        </div>
                        <form className="relative flex w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full md:w-80 pl-5 pr-32 py-3.5 bg-slate-800/50 border border-slate-700 rounded-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all backdrop-blur-sm"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary hover:bg-primary/90 text-white px-6 rounded-full font-medium transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white font-display">
                                Notes<span className="text-primary">Bundle</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 mb-6 max-w-sm">
                            Your one-stop destination for high-quality digital notes and study materials.
                            Ace your exams with our comprehensive collection.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Youtube className="w-5 h-5" />
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
                                <span>support@notesbundle.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-primary mt-0.5" />
                                <span>+91 98765 43210</span>
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
