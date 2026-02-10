import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthProvider from '@/components/providers/AuthProvider';
import { GLOBAL_KEYWORDS } from '@/lib/seo-keywords';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://notesbundle.com'),
    title: {
        default: 'NotesBundle - Premium Study Materials & Digital Notes',
        template: '%s | NotesBundle',
    },
    description: 'Get high-quality digital notes for GATE, Engineering, Competitive Exams, Coding, and more. Affordable study materials with instant download.',
    keywords: [
        'study notes',
        'GATE preparation',
        ...GLOBAL_KEYWORDS
    ],
    authors: [{ name: 'NotesBundle' }],
    creator: 'NotesBundle',
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://notesbundle.com',
        siteName: 'NotesBundle',
        title: 'NotesBundle - Premium Study Materials & Digital Notes',
        description: 'Get high-quality digital notes for GATE, Engineering, Competitive Exams, and more.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'NotesBundle',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NotesBundle - Premium Study Materials',
        description: 'High-quality digital notes for GATE, Engineering, Competitive Exams.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    manifest: '/manifest.json',
    themeColor: '#2563eb',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
    appleWebApp: {
        title: 'NotesBundle',
        statusBarStyle: 'default',
        startupImage: [
            '/icons/icon-512x512.png',
        ],
    },
    verification: {
        google: 'l-Kp4culgSOdGiMZXHDZdtDAqnaOD_SI-yWjvMfZlfY',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#2563eb" />
            </head>
            <body className="min-h-screen flex flex-col">
                <AuthProvider>
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </AuthProvider>
                <Script
                    id="adsbygoogle-init"
                    strategy="afterInteractive"
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5736081163311751"
                    crossOrigin="anonymous"
                />
                <meta name="google-adsense-account" content="ca-pub-5736081163311751" />
            </body>
        </html>
    );
}
