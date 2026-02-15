import type { Metadata, Viewport } from 'next';
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
    metadataBase: new URL('https://notesbundle.online'),
    title: {
        default: 'NotesBundle - Premium Study Materials & Digital Notes',
        template: '%s | NotesBundle',
    },
    description: 'Download premium quality handwritten and digital notes for GATE, Government Exams, Engineering, and Coding. Instant access to best study materials.',
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
        url: 'https://notesbundle.online',
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
    other: {
        'mobile-web-app-capable': 'yes',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#2563eb',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <head>
                <link rel="icon" href="/images/logo.jpg" sizes="any" />
                <link rel="apple-touch-icon" href="/images/logo.jpg" />
                <meta name="theme-color" content="#2563eb" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5736081163311751" crossOrigin="anonymous"></script>
            </head>
            <body className="min-h-screen flex flex-col">
                <AuthProvider>
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </AuthProvider>
                <meta name="google-adsense-account" content="ca-pub-5736081163311751" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@graph': [
                                {
                                    '@type': 'Organization',
                                    '@id': 'https://notesbundle.online/#organization',
                                    'name': 'NotesBundle',
                                    'url': 'https://notesbundle.online',
                                    'logo': {
                                        '@type': 'ImageObject',
                                        'url': 'https://notesbundle.online/icons/icon-512x512.png',
                                        'width': 512,
                                        'height': 512,
                                    },
                                    'sameAs': [
                                        'https://notesbundle.online',
                                        // Add social profiles here later
                                    ],
                                },
                                {
                                    '@type': 'WebSite',
                                    '@id': 'https://notesbundle.online/#website',
                                    'url': 'https://notesbundle.online',
                                    'name': 'NotesBundle',
                                    'publisher': {
                                        '@id': 'https://notesbundle.online/#organization',
                                    },
                                    'potentialAction': {
                                        '@type': 'SearchAction',
                                        'target': 'https://notesbundle.online/search?q={search_term_string}',
                                        'query-input': 'required name=search_term_string',
                                    },
                                },
                            ],
                        }),
                    }}
                />
            </body>
        </html>
    );
}
