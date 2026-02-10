'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    FolderTree,
    Folder,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    parentId: string | null;
    parent?: Category;
    children?: Category[];
    _count?: {
        notes: number;
    };
}

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parentId: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingCategory
                ? `/api/admin/categories/${editingCategory.id}`
                : '/api/admin/categories';

            const method = editingCategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    parentId: formData.parentId || null,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.error || 'Failed to save category');
                return;
            }

            setShowModal(false);
            setEditingCategory(null);
            resetForm();
            fetchCategories();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.error || 'Failed to delete category');
                return;
            }

            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('An error occurred');
        }
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            parentId: category.parentId || '',
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            parentId: '',
        });
    };

    // Generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: !editingCategory ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug
        }));
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get potential parents (exclude self and children to avoid cycles if editing)
    const potentialParents = categories.filter(c =>
        !editingCategory || (c.id !== editingCategory.id && c.parentId !== editingCategory.id)
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Categories</h1>
                    <p className="text-muted-foreground">Manage product categories and subcategories</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        resetForm();
                        setShowModal(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <div className="card p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-11"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-border">
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Slug</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Parent</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Notes</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((category) => (
                                    <tr key={category.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {category.parentId ? (
                                                    <Folder className="w-4 h-4 text-muted-foreground ml-4" />
                                                ) : (
                                                    <FolderTree className="w-4 h-4 text-primary" />
                                                )}
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-mono text-muted-foreground">{category.slug}</td>
                                        <td className="p-4 text-sm">
                                            {category.parent ? (
                                                <span className="badge bg-slate-100 text-slate-700">
                                                    {category.parent.name}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="p-4 text-sm">{category._count?.notes || 0}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No categories found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="input font-mono text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Parent Category</label>
                                <select
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                    className="input"
                                >
                                    <option value="">None (Top Level)</option>
                                    {potentialParents.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input min-h-[100px]"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Category'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
