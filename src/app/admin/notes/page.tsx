'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Download,
    Star,
    ChevronDown,
    Loader2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Note {
    id: string;
    title: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    isPublished: boolean;
    isFeatured: boolean;
    viewCount: number;
    downloadCount: number;
    averageRating: number;
    totalReviews: number;
    thumbnailUrl: string | null;
    createdAt: string;
    category: { name: string; slug: string } | null;
    _count: { reviews: number; orderItems: number };
}

interface NotesResponse {
    notes: Note[];
    total: number;
    page: number;
    totalPages: number;
}

export default function AdminNotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalNotes, setTotalNotes] = useState(0);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.set('search', searchTerm);
            if (statusFilter !== 'all') params.set('status', statusFilter);
            params.set('page', currentPage.toString());
            params.set('limit', '15');

            const res = await fetch(`/api/admin/notes?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch notes');

            const data: NotesResponse = await res.json();
            setNotes(data.notes);
            setTotalPages(data.totalPages);
            setTotalNotes(data.total);
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [currentPage, statusFilter]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setCurrentPage(1);
            fetchNotes();
        }, 400);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleDelete = async (noteId: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete note');
            toast.success('Note deleted successfully');
            fetchNotes();
        } catch (error) {
            toast.error('Failed to delete note');
        }
    };

    const getStatusBadge = (note: Note) => {
        if (note.isFeatured) {
            return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Featured</span>;
        }
        if (note.isPublished) {
            return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Published</span>;
        }
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">Draft</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Notes Management</h1>
                    <p className="text-muted-foreground mt-1">{totalNotes} total notes</p>
                </div>
                <Link
                    href="/admin/notes/create"
                    className="btn-primary rounded-xl px-5 py-2.5 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add New Note
                </Link>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search notes by title or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            className="appearance-none w-full sm:w-48 px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="featured">Featured</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Notes Table */}
            {loading ? (
                <div className="card p-16 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Loading notes...</span>
                </div>
            ) : notes.length === 0 ? (
                <div className="card p-16 text-center">
                    <p className="text-muted-foreground text-lg">No notes found</p>
                    <p className="text-muted-foreground text-sm mt-2">
                        {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first note to get started'}
                    </p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-secondary/50">
                                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Note</th>
                                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Stats</th>
                                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Status</th>
                                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {notes.map((note) => (
                                    <tr key={note.id} className="hover:bg-secondary/30 transition-colors">
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                                                    {note.thumbnailUrl ? (
                                                        <img src={note.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-primary text-xs font-bold">N</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground text-sm truncate max-w-[200px] lg:max-w-[300px]">{note.title}</p>
                                                    <p className="text-xs text-muted-foreground hidden sm:block">
                                                        {new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 hidden md:table-cell">
                                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                                {note.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div>
                                                {note.price === 0 ? (
                                                    <span className="text-emerald-600 font-semibold text-sm">Free</span>
                                                ) : (
                                                    <>
                                                        <span className="font-semibold text-foreground text-sm">₹{note.discountPrice || note.price}</span>
                                                        {note.discountPrice && (
                                                            <span className="text-xs text-muted-foreground line-through ml-1">₹{note.price}</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 hidden lg:table-cell">
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{note.viewCount}</span>
                                                <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{note.downloadCount}</span>
                                                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" />{note.averageRating.toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 hidden sm:table-cell">
                                            {getStatusBadge(note)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setActiveDropdown(activeDropdown === note.id ? null : note.id)}
                                                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                {activeDropdown === note.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() => setActiveDropdown(null)}
                                                        />
                                                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-strong border border-border z-20 py-1.5">
                                                            <Link
                                                                href={`/notes/${note.slug}`}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-secondary transition-colors"
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                <Eye className="w-4 h-4" /> View
                                                            </Link>
                                                            <Link
                                                                href={`/admin/notes/${note.id}`}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-secondary transition-colors"
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                <Edit className="w-4 h-4" /> Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => { setActiveDropdown(null); handleDelete(note.id); }}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                                            >
                                                                <Trash2 className="w-4 h-4" /> Delete
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages} ({totalNotes} notes)
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-40"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-40"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
