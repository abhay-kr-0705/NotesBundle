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
    const [scale, setScale] = useState(1.0);
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
        <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col h-[80vh]">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800 text-white z-10">
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-lg max-w-[200px] truncate" title={noteTitle}>
                        {noteTitle}
                    </span>
                    <span className="text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-400">
                        Preview Mode
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-zinc-800 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                            className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
                            title="Zoom Out"
                        >
                            <span className="text-lg leading-none">-</span>
                        </button>
                        <span className="px-2 flex items-center text-sm font-medium text-zinc-300 w-12 justify-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={() => setScale(s => Math.min(2.0, s + 0.1))}
                            className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
                            title="Zoom In"
                        >
                            <span className="text-lg leading-none">+</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="relative flex-1 bg-zinc-950 overflow-auto flex justify-center p-8">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 z-10">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                        <p>Loading document...</p>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 z-10 p-4 text-center">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6" />
                        </div>
                        <p className="font-medium mb-1">{error}</p>
                        <button onClick={() => window.location.reload()} className="text-sm underline opacity-80 hover:opacity-100">
                            Try refreshing
                        </button>
                    </div>
                )}

                {!error && (
                    <div className="relative shadow-2xl transition-transform duration-200 ease-out" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
                        <Document
                            file={previewUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={null}
                            className="flex justify-center"
                        >
                            <Page
                                pageNumber={pageNumber}
                                width={500}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="bg-white"
                            />
                        </Document>

                        {/* Overlay for last preview page */}
                        {isLastPreviewPage && !loading && (
                            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-zinc-900 via-zinc-900/90 to-transparent flex flex-col items-center justify-end pb-12 z-20">
                                <Lock className="w-12 h-12 text-white mb-4 drop-shadow-lg" />
                                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                                    Unlock Full Access
                                </h3>
                                <p className="text-zinc-300 mb-6 text-center max-w-sm drop-shadow-sm px-4">
                                    Purchase to read all {numPages} pages of this note.
                                </p>
                                <Link
                                    href={`/notes/${noteSlug}`}
                                    className="btn-primary px-8 py-3 text-lg shadow-xl shadow-primary/25 hover:scale-105 transition-transform"
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Buy Now for ₹{displayPrice}
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Pagination */}
            <div className="border-t border-zinc-800 bg-zinc-900 p-4 flex items-center justify-center gap-4 z-10">
                <button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="p-2.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-zinc-300 font-medium font-mono bg-zinc-950 px-4 py-2 rounded-lg border border-zinc-800">
                    {pageNumber} <span className="text-zinc-600">/</span> {maxPreviewPage}
                </div>

                <button
                    onClick={goToNextPage}
                    disabled={pageNumber >= maxPreviewPage}
                    className="p-2.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
