import { BookOpen, Layers } from 'lucide-react';

interface LogoProps {
    className?: string;
    variant?: 'default' | 'mobile';
}

export default function Logo({ className = '', variant = 'default' }: LogoProps) {
    if (variant === 'mobile') {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <BookOpen className="w-5 h-5 text-white" />
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 group ${className}`}>
            <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105">
                    <Layers className="w-6 h-6 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90" />
                    <BookOpen className="w-6 h-6 text-white group-hover:opacity-0 transition-opacity duration-300" />
                </div>
                {/* Decorative dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="flex flex-col -space-y-1">
                <span className="text-xl font-bold text-slate-900 font-display tracking-tight">
                    Notes<span className="text-indigo-600">Bundle</span>
                </span>
            </div>
        </div>
    );
}
