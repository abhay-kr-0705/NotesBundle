'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search, Star } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        notes: number;
    };
}

interface NotesFilterProps {
    categories: Category[];
}

export default function NotesFilter({ categories }: NotesFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initial State from URL
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.getAll('category') // 'category' param can be multiple
    );
    // Determine price range
    const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');
    const [minRating, setMinRating] = useState(searchParams.get('rating') || '');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Apply filters immediately for other changes
    useEffect(() => {
        applyFilters();
    }, [selectedCategories, priceRange, minRating]);

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (search) params.set('search', search);

        // Handle multiple categories
        selectedCategories.forEach(cat => {
            params.append('category', cat);
        });

        if (priceRange) params.set('price', priceRange);
        if (minRating) params.set('rating', minRating);

        // Preserve sort if exists
        const sort = searchParams.get('sort');
        if (sort) params.set('sort', sort);

        router.push(`/notes?${params.toString()}`);
    };

    const handleCategoryChange = (slug: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(slug)) {
                return prev.filter(c => c !== slug);
            } else {
                return [...prev, slug];
            }
        });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategories([]);
        setPriceRange('');
        setMinRating('');
        router.push('/notes');
    };

    return (
        <aside className="lg:w-72 shrink-0">
            <div className="card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5" />
                        Filters
                    </h2>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-primary hover:underline"
                    >
                        Clear all
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10 py-2.5 text-sm"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-3">Categories</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {categories.map((category) => (
                            <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.slug)}
                                    onChange={() => handleCategoryChange(category.slug)}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors text-sm">
                                    {category.name}
                                </span>
                                {category._count && (
                                    <span className="text-xs text-muted-foreground ml-auto">
                                        ({category._count.notes})
                                    </span>
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-3">Price</h3>
                    <div className="space-y-2">
                        {[
                            { label: 'All', value: '' },
                            { label: 'Free', value: 'free' },
                            { label: 'Under ₹100', value: 'under-100' },
                            { label: '₹100 - ₹200', value: '100-200' },
                            { label: 'Above ₹200', value: 'above-200' },
                        ].map((option) => (
                            <label key={option.label} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="price"
                                    checked={priceRange === option.value}
                                    onChange={() => setPriceRange(option.value)}
                                    className="w-4 h-4 border-border text-primary focus:ring-primary"
                                />
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors text-sm">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div>
                    <h3 className="font-medium text-foreground mb-3">Rating</h3>
                    <div className="space-y-2">
                        {[4, 3, 2].map((rating) => (
                            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={minRating === rating.toString()}
                                    onChange={() => setMinRating(minRating === rating.toString() ? '' : rating.toString())}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors text-sm">
                                    {rating}+ <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
