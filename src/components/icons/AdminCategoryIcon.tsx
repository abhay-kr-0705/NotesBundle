import React from 'react';

export const AdminCategoryIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect x="2" y="2" width="9" height="9" rx="3" fill="currentColor" />
            <rect x="13" y="2" width="9" height="9" rx="3" fill="currentColor" />
            <rect x="2" y="13" width="9" height="9" rx="3" fill="currentColor" />
            <circle cx="17.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
};
