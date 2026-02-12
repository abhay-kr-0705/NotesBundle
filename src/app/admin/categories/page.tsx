'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Folder,
    FolderOpen,
    Loader2,
    ChevronRight,
    Search
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    description: string | null;
    icon: string | null;
    children?: Category[];
    _count?: {
        notes: number;
    };
    parent?: {
        name: string;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        parentId: '',
        description: '',
        icon: ''
    });

    const flatCategories = categories; // API returns flat list currently, will organize for display

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                parentId: category.parentId || '',
                description: category.description || '',
                icon: category.icon || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                parentId: '',
                description: '',
                icon: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleAddSubcategory = (parentCategory: Category) => {
        setEditingCategory(null);
        setFormData({
            name: '',
            slug: '',
            parentId: parentCategory.id,
            description: '',
            icon: ''
        });
        setIsModalOpen(true);
    };

    const handleSlugify = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = '/api/admin/categories';
            const method = editingCategory ? 'PUT' : 'POST';
            const body = {
                ...formData,
                id: editingCategory?.id,
                parentId: formData.parentId || null
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to save category');
            }

            toast.success(editingCategory ? 'Category updated' : 'Category created');
            setIsModalOpen(false);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to delete category');
            }

            toast.success('Category deleted');
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Filter and Group Categories Logic
    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group for display: Roots then Children
    const rootCategories = filteredCategories.filter(c => !c.parentId);
    const childCategories = filteredCategories.filter(c => c.parentId);

    const getChildrenFor = (parentId: string) => childCategories.filter(c => c.parentId === parentId);

    // Simple auto-slug generator
    useEffect(() => {
        if (!editingCategory && formData.name) {
            setFormData(prev => ({ ...prev, slug: handleSlugify(prev.name) }));
        }
    }, [formData.name, editingCategory]);

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Categories</h1>
                    <p className="text-muted-foreground">Manage your store's categories and subcategories</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                />
            </div>

            {/* Categories List (Grouped) */}
            <div className="card divide-y divide-border">
                {rootCategories.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No categories found. Create one to get started.
                    </div>
                ) : (
                    rootCategories.map(category => (
                        <div key={category.id} className="group">
                            {/* Parent Row */}
                            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <Folder className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                                            {category.name}
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-normal">
                                                /{category.slug}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {category._count?.notes || 0} notes • {getChildrenFor(category.id).length} subcategories
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleAddSubcategory(category)}
                                        className="p-2 hover:bg-primary/10 rounded-lg border border-transparent hover:border-primary/20 text-primary transition-all"
                                        title="Add Subcategory"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(category)}
                                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-border text-slate-600 transition-all"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 text-red-600 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Children Rows */}
                            {getChildrenFor(category.id).map(child => (
                                <div key={child.id} className="bg-slate-50/50 pl-14 pr-4 py-3 flex items-center justify-between hover:bg-slate-100/50 transition-colors border-t border-border/50 group/child">
                                    <div className="flex items-center gap-3">
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        <div className="w-8 h-8 bg-white border border-border rounded-lg flex items-center justify-center text-slate-500">
                                            <FolderOpen className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground text-sm flex items-center gap-2">
                                                {child.name}
                                                <span className="text-[10px] bg-white border border-border px-1.5 py-0.5 rounded-full text-muted-foreground">
                                                    /{child.slug}
                                                </span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {child._count?.notes || 0} notes
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover/child:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(child)}
                                            className="p-1.5 hover:bg-white rounded border border-transparent hover:border-border text-slate-600 transition-all"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(child.id, child.name)}
                                            className="p-1.5 hover:bg-red-50 rounded border border-transparent hover:border-red-100 text-red-600 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h2 className="text-lg font-bold text-foreground">
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Slug <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="input bg-slate-50 font-mono text-sm"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: handleSlugify(e.target.value) }))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Parent Category</label>
                                <select
                                    className="input"
                                    value={formData.parentId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                                >
                                    <option value="">None (Top Level)</option>
                                    {categories
                                        .filter(c => !c.parentId && c.id !== editingCategory?.id) // Prevent self-parenting and deeper nesting for now
                                        .map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                                <textarea
                                    className="input min-h-[80px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Optional description"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
