import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { FileText, Download, ExternalLink, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default async function MyNotesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login?callbackUrl=/my-notes');
    }

    const userId = (session.user as any).id;

    // Fetch paid orders
    const orders = await prisma.order.findMany({
        where: {
            userId: userId,
            status: 'PAID',
        },
        include: {
            items: {
                include: {
                    note: {
                        include: {
                            category: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Flatten items and remove duplicates (if any)
    const purchasedNotesMap = new Map();

    orders.forEach(order => {
        order.items.forEach(item => {
            if (item.note && !purchasedNotesMap.has(item.note.id)) {
                purchasedNotesMap.set(item.note.id, item.note);
            }
        });
    });

    const notes = Array.from(purchasedNotesMap.values());

    return (
        <div className="min-h-screen pt-24 pb-16 bg-background">
            <div className="container-custom">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Notes</h1>
                        <p className="text-muted-foreground">Access all your purchased study materials</p>
                    </div>
                </div>

                {notes.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-3xl border border-border">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">No notes found</h2>
                        <p className="text-muted-foreground mb-8">You haven't purchased any notes yet.</p>
                        <Link href="/notes" className="btn-primary">
                            Browse Notes
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div key={note.id} className="card group flex flex-col h-full">
                                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden rounded-t-2xl">
                                    {note.thumbnailUrl ? (
                                        <img
                                            src={note.thumbnailUrl}
                                            alt={note.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-slate-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className="badge bg-white/90 backdrop-blur-sm shadow-sm text-foreground">
                                            {note.category?.name || 'Note'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {note.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                        {note.shortDescription || note.description}
                                    </p>

                                    <div className="flex gap-3 mt-auto">
                                        <Link
                                            href={`/notes/${note.slug}`}
                                            className="btn-secondary flex-1 text-center text-sm"
                                        >
                                            View Details
                                        </Link>

                                        {note.externalUrl ? (
                                            <a
                                                href={note.externalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-primary flex-1 text-center flex items-center justify-center gap-2 text-sm"
                                            >
                                                <ExternalLink className="w-4 h-4" /> Open
                                            </a>
                                        ) : note.fileUrl ? (
                                            <a
                                                href={note.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-primary flex-1 text-center flex items-center justify-center gap-2 text-sm"
                                            >
                                                <Download className="w-4 h-4" /> Download
                                            </a>
                                        ) : (
                                            <button disabled className="btn-secondary opacity-50 flex-1 text-sm cursor-not-allowed">
                                                No File
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
