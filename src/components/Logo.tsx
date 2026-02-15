import Image from 'next/image';

interface LogoProps {
    className?: string;
    variant?: 'default' | 'mobile';
}

export default function Logo({ className = '', variant = 'default' }: LogoProps) {
    if (variant === 'mobile') {
        return (
            <div className={`relative w-8 h-8 rounded-lg overflow-hidden ${className}`}>
                <Image
                    src="/images/logo.jpg"
                    alt="NotesBundle Logo"
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 group ${className}`}>
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <Image
                    src="/images/logo.jpg"
                    alt="NotesBundle Logo"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col -space-y-1">
                <span className="text-2xl font-bold text-slate-900 font-display tracking-tight leading-none">
                    Notes<span className="text-indigo-600">Bundle</span>
                </span>
            </div>
        </div>
    );
}
