'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';

export default function RefreshAnalytics() {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();

        // Add a small delay to show feedback, even if refresh is instant
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors disabled:opacity-50"
            title="Refresh Data"
        >
            <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
    );
}
