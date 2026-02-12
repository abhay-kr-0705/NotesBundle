'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface NotesToolbarProps {
    totalNotes: number;
    currentSort?: string;
    currentView?: string;
}

export default function NotesToolbar({ totalNotes, currentSort, currentView }: NotesToolbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [view, setView] = useState(currentView || 'grid');

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        const value = e.target.value;
        if (value) {
            params.set('sort', value);
        } else {
            params.delete('sort');
        }
        params.delete('page'); // Reset to page 1 on sort change
        router.push(`/notes?${params.toString()}`);
    };

    const toggleView = (newView: string) => {
        setView(newView);
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', newView);
        router.push(`/notes?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <p className="text-muted-foreground text-sm sm:text-base">
                Showing <span className="font-semibold text-foreground">{totalNotes}</span> notes
            </p>
            <div className="flex items-center gap-3">
                <select
                    className="input py-2 px-3 w-auto text-sm"
                    value={currentSort || ''}
                    onChange={handleSortChange}
                >
                    <option value="">Newest</option>
                    <option value="popular">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                </select>
                <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1">
                    <button
                        onClick={() => toggleView('grid')}
                        className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
                    >
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => toggleView('list')}
                        className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
