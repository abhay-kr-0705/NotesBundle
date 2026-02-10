import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        let recommendedNotes: any[] = [];

        // If user is logged in, try to fetch recommendations based on interests
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { interests: true },
            });

            if (user && user.interests.length > 0) {
                // Find notes where category slug is in user's interests
                // Note: We need to filter by category relation
                recommendedNotes = await prisma.note.findMany({
                    where: {
                        isPublished: true,
                        category: {
                            slug: {
                                in: user.interests
                            }
                        }
                    },
                    take: 8,
                    orderBy: {
                        averageRating: 'desc',
                    },
                    include: {
                        category: {
                            select: {
                                name: true,
                                slug: true,
                            }
                        }
                    }
                });
            }
        }

        // If no personalized recommendations (not logged in, no interests, or no matching notes),
        // fetch popular/featured notes instead
        if (recommendedNotes.length === 0) {
            recommendedNotes = await prisma.note.findMany({
                where: {
                    isPublished: true,
                    isFeatured: true,
                },
                take: 8,
                orderBy: {
                    viewCount: 'desc',
                },
                include: {
                    category: {
                        select: {
                            name: true,
                            slug: true,
                        }
                    }
                }
            });
        }

        return NextResponse.json({ notes: recommendedNotes });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recommendations' },
            { status: 500 }
        );
    }
}
