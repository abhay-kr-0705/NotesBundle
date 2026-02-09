'use client';

import { useState } from 'react';
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
    ChevronDown
} from 'lucide-react';

// Sample notes data
const sampleNotes = [
    {
        id: '1',
        title: 'Complete GATE CSE Notes 2024',
        category: 'GATE',
        price: 299,
        discountPrice: 199,
        views: 15234,
        downloads: 1520,
        rating: 4.8,
        status: 'published',
        createdAt: '2024-01-10'
    },
    {
        id: '2',
        title: 'BEU 3rd Semester All Subjects',
        category: 'Engineering',
        price: 199,
        discountPrice: null,
        views: 8923,
        downloads: 890,
        rating: 4.6,
        status: 'published',
        createdAt: '2024-01-08'
    },
    {
        id: '3',
        title: 'SSC CGL Complete Preparation',
        category: 'Competitive',
        price: 0,
        discountPrice: null,
        views: 23456,
        downloads: 2340,
        rating: 4.9,
        status: 'published',
        createdAt: '2024-01-05'
    },
    {
        id: '4',
        title: 'Python Programming Notes',
        category: 'Coding',
        price: 149,
        discountPrice: 99,
        views: 11023,
        downloads: 1100,
        rating: 4.7,
        status: 'draft',
        createdAt: '2024-01-03'
    },
];

const statusColors: { [key: string]: string } = {
    published: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-amber-100 text-amber-700',
    archived: 'bg-slate-100 text-slate-700',
};

export default function AdminNotesPage() {
    const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSelectAll = () => {
        if (selectedNotes.length === sampleNotes.length) {
            setSelectedNotes([]);
        } else {
            setSelectedNotes(sampleNotes.map(n => n.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedNotes.includes(id)) {
            setSelectedNotes(selectedNotes.filter(n => n !== id));
        } else {
            setSelectedNotes([...selectedNotes, id]);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Notes Management</h1>
                    <p className="text-muted-foreground">Manage all your study materials and digital notes</p>
                </div>
                <Link href="/admin/notes/new" className="btn-primary">
                    <Plus className="w-5 h-5" />
                    Add New Note
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select className="input w-auto">
                            <option>All Categories</option>
                            <option>GATE</option>
                            <option>Engineering</option>
                            <option>Competitive</option>
                            <option>Coding</option>
                        </select>
                        <select className="input w-auto">
                            <option>All Status</option>
                            <option>Published</option>
                            <option>Draft</option>
                            <option>Archived</option>
                        </select>
                        <button className="btn-secondary">
                            <Filter className="w-4 h-4" />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Notes Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-border">
                                <th className="p-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedNotes.length === sampleNotes.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                    />
                                </th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Title</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Category</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Price</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Views</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Downloads</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Rating</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleNotes.map((note) => (
                                <tr key={note.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedNotes.includes(note.id)}
                                            onChange={() => toggleSelect(note.id)}
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium text-foreground">{note.title}</p>
                                        <p className="text-sm text-muted-foreground">{note.createdAt}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="badge-primary">{note.category}</span>
                                    </td>
                                    <td className="p-4">
                                        {note.price === 0 ? (
                                            <span className="font-medium text-accent">Free</span>
                                        ) : (
                                            <div>
                                                <span className="font-semibold text-foreground">₹{note.discountPrice || note.price}</span>
                                                {note.discountPrice && (
                                                    <span className="text-sm text-muted-foreground line-through ml-2">₹{note.price}</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <Eye className="w-4 h-4" />
                                            {note.views.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <Download className="w-4 h-4" />
                                            {note.downloads.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            {note.rating}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`badge capitalize ${statusColors[note.status]}`}>
                                            {note.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/notes/${note.id}`}
                                                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-border flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">1-{sampleNotes.length}</span> of <span className="font-medium">{sampleNotes.length}</span> notes
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="btn-ghost px-3 py-1.5 text-sm" disabled>Previous</button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-medium">1</button>
                        <button className="btn-ghost px-3 py-1.5 text-sm" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
