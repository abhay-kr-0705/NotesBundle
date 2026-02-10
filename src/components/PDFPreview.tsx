'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Lock, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Set up PDF.js worker
// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFPreviewProps {
    previewUrl: string;
    previewPages: number;
    noteTitle: string;
    noteSlug: string;
    price: number;
    discountPrice?: number | null;
}

export default function PDFPreview({
    previewUrl,
    previewPages,
    noteTitle,
    noteSlug,
    price,
    discountPrice,
}: PDFPreviewProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const maxPreviewPage = Math.min(previewPages, numPages);
    const isLastPreviewPage = pageNumber >= maxPreviewPage;

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(err: Error) {
        setError('Failed to load PDF preview');
        setLoading(false);
        console.error('PDF load error:', err);
    }

    function goToPrevPage() {
        setPageNumber((prev) => Math.max(prev - 1, 1));
    }

    function goToNextPage() {
        if (pageNumber < maxPreviewPage) {
            setPageNumber((prev) => prev + 1);
        }
    }

    const displayPrice = discountPrice || price;

    return (
        <div className="bg-slate-900 rounded-2xl overflow-hidden">
            {/* PDF Viewer */}
            <div className="relative aspect-[3/4] bg-slate-800 flex items-center justify-center">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="text-red-400 text-center p-4">
                        <p>{error}</p>
                        <p className="text-sm text-slate-500 mt-2">Please try again later</p>
                    </div>
                )}

                {!error && (
                    <Document
                        file={previewUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                        className="flex justify-center"
                    >
                        <Page
                            pageNumber={pageNumber}
                            width={400}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="shadow-2xl"
                        />
                    </Document>
                )}

                {/* Overlay for last preview page */}
                {isLastPreviewPage && !loading && !error && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent flex flex-col items-center justify-end pb-12 z-20">
                        <Lock className="w-16 h-16 text-slate-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                            Preview ends here
                        </h3>
                        <p className="text-slate-400 mb-6 text-center max-w-sm">
                            Get full access to all {numPages} pages of "{noteTitle}"
                        </p>
                        <Link
                            href={`/notes/${noteSlug}`}
                            className="btn-primary px-8 py-3 text-lg"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Buy for ₹{displayPrice}
                        </Link>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-4 bg-slate-800/50">
                <button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="text-slate-300 text-sm">
                    <span className="font-medium">Page {pageNumber}</span>
                    <span className="text-slate-500"> of {maxPreviewPage} preview</span>
                    {numPages > maxPreviewPage && (
                        <span className="text-slate-600"> ({numPages} total)</span>
                    )}
                </div>

                <button
                    onClick={goToNextPage}
                    disabled={pageNumber >= maxPreviewPage}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
