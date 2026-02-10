import Link from 'next/link';
import { SEO_KEYWORDS } from '@/lib/seo-keywords';

export default function PopularTags() {
    return (
        <section className="py-12 bg-white border-t border-border">
            <div className="container-custom">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Most Searched Topics</h2>
                    <p className="text-muted-foreground">Explore our most popular study materials and notes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Bihar Special */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                            Bihar Exams
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {SEO_KEYWORDS.biharSpecial.slice(0, 10).map((tag, i) => (
                                <Link
                                    key={i}
                                    href={`/search?q=${encodeURIComponent(tag)}`}
                                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* General Competition */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                            Competitive Exams
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {SEO_KEYWORDS.generalCompetition.slice(0, 10).map((tag, i) => (
                                <Link
                                    key={i}
                                    href={`/search?q=${encodeURIComponent(tag)}`}
                                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Engineering */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                            Engineering Notes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {SEO_KEYWORDS.engineering.slice(0, 10).map((tag, i) => (
                                <Link
                                    key={i}
                                    href={`/search?q=${encodeURIComponent(tag)}`}
                                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Student Slang / Popular */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                            Trending Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {SEO_KEYWORDS.studentSlang.slice(0, 10).map((tag, i) => (
                                <Link
                                    key={i}
                                    href={`/search?q=${encodeURIComponent(tag)}`}
                                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-dashed border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong>Popular Tags:</strong> {SEO_KEYWORDS.buyerIntent.join(', ')}
                    </p>
                </div>
            </div>
        </section>
    );
}
