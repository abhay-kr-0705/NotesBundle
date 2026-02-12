'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Aman Kumar',
        role: 'GATE CSE 2025 Aspirant',
        avatar: 'AK',
        rating: 5,
        text: 'NotesBundle completely transformed my preparation. The GATE notes are incredibly well-structured and cover every topic in detail. Saved me months of effort!',
    },
    {
        name: 'Priya Sharma',
        role: 'BEU 4th Semester Student',
        avatar: 'PS',
        rating: 5,
        text: 'The semester notes are a lifesaver! Crystal clear explanations with proper diagrams. I scored 9.2 SGPA last semester thanks to these notes.',
    },
    {
        name: 'Rahul Verma',
        role: 'SSC CGL Aspirant',
        avatar: 'RV',
        rating: 4,
        text: 'Best competitive exam notes I have found online. The PYQs section with solutions helped me understand the exam pattern perfectly.',
    },
    {
        name: 'Sneha Gupta',
        role: 'Web Development Learner',
        avatar: 'SG',
        rating: 5,
        text: 'The coding notes are fantastic! Well-organized, with practical examples. I went from zero to building projects in just weeks using these notes.',
    },
    {
        name: 'Vikrant Singh',
        role: 'Railway RRB Aspirant',
        avatar: 'VS',
        rating: 5,
        text: 'I cleared RRB NTPC on my first attempt thanks to the comprehensive study material here. The handbooks for quick revision were super helpful.',
    },
    {
        name: 'Anjali Mishra',
        role: 'GATE ECE Qualifier',
        avatar: 'AM',
        rating: 5,
        text: 'Qualified GATE with AIR under 500! The subject-wise notes and formula sheets made revision so much easier. Highly recommend to all aspirants.',
    },
    {
        name: 'Deepak Yadav',
        role: 'BEU 6th Semester',
        avatar: 'DY',
        rating: 4,
        text: 'Great collection of engineering notes. PYQ solutions are accurate and well-explained. The best part is instant download — no waiting around.',
    },
    {
        name: 'Kavita Rajput',
        role: 'BPSC Aspirant',
        avatar: 'KR',
        rating: 5,
        text: 'Finally found quality study materials for Bihar state exams! The content is up-to-date and covers the latest syllabus. Worth every penny.',
    },
];

export default function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Number of visible cards depends on screen
    const getVisibleCount = useCallback(() => {
        if (typeof window === 'undefined') return 3;
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }, []);

    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const handleResize = () => setVisibleCount(getVisibleCount());
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [getVisibleCount]);

    const maxIndex = Math.max(0, testimonials.length - visibleCount);

    // Auto rotate
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(interval);
    }, [isPaused, maxIndex]);

    const goToPrev = () => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    const goToNext = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Carousel */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                    }}
                >
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="px-3 shrink-0"
                            style={{ width: `${100 / visibleCount}%` }}
                        >
                            <div className="card p-6 h-full flex flex-col relative overflow-hidden">
                                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-3 pt-4 border-t border-border">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 w-10 h-10 bg-white border border-border rounded-full shadow-md flex items-center justify-center hover:bg-secondary transition-colors z-10"
            >
                <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 w-10 h-10 bg-white border border-border rounded-full shadow-md flex items-center justify-center hover:bg-secondary transition-colors z-10"
            >
                <ChevronRight className="w-5 h-5 text-foreground" />
            </button>

            {/* Dots navigation */}
            <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`transition-all duration-300 rounded-full ${currentIndex === i
                            ? 'w-8 h-2.5 bg-primary'
                            : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
