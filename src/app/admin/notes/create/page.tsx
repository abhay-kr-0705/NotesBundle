'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Upload,
    X,
    Loader2
} from 'lucide-react';
import { BRANCHES } from '@/lib/constants';

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function NewNotePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [fileStats, setFileStats] = useState<{ name: string; size: number } | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/admin/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        price: '',
        discountPrice: '',
        categoryId: '', // Use ID instead of slug
        tags: '',
        examType: '',
        university: '',
        semester: '',
        branch: '',
        subject: '',
        language: 'English',
        pages: '',
        previewPages: '5',
        fileUrl: '',
        previewUrl: '',
        thumbnailUrl: '',
        isFeatured: false,
        isPublished: true,
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });

            if (!res.ok) throw new Error('Upload failed');

            const result = await res.json();
            setFormData(prev => ({
                ...prev,
                fileUrl: result.fileUrl,
                previewUrl: result.previewUrl,
            }));
            setFileStats({ name: file.name, size: file.size });
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to create note');

            router.push('/admin/notes');
            router.refresh();
        } catch (error) {
            console.error('Submit error:', error);
            alert('Failed to create note');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/notes" className="p-2 rounded-lg hover:bg-secondary">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Add New Note</h1>
                    <p className="text-muted-foreground">Create a new study material or digital note</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="card p-6">
                            <h2 className="font-semibold text-foreground mb-4">Basic Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter note title"
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Short Description
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.shortDescription}
                                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                        placeholder="Brief description (shown in cards)"
                                        className="input"
                                        maxLength={150}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Full Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Detailed description of the notes..."
                                        className="input min-h-[150px]"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="card p-6">
                            <h2 className="font-semibold text-foreground mb-4">Files</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Note File (PDF) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {uploading ? (
                                            <div className="flex flex-col items-center">
                                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                                                <p>Uploading to Cloudinary...</p>
                                            </div>
                                        ) : fileStats ? (
                                            <div className="flex flex-col items-center text-green-600">
                                                <Upload className="w-10 h-10 mb-3" />
                                                <p className="font-medium">{fileStats.name}</p>
                                                <p className="text-sm">{(fileStats.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                                <p className="text-foreground font-medium mb-1">Click to upload or drag and drop</p>
                                                <p className="text-sm text-muted-foreground">PDF files only (max 50MB)</p>
                                            </div>
                                        )}
                                    </div>
                                    {formData.fileUrl && <p className="text-xs text-green-600 mt-2">File uploaded successfully</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Thumbnail Image (Optional)
                                    </label>
                                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                if (!file.type.startsWith('image/')) {
                                                    alert('Please upload an image file');
                                                    return;
                                                }
                                                setUploadingThumbnail(true);
                                                const data = new FormData();
                                                data.append('file', file);
                                                try {
                                                    const res = await fetch('/api/upload/image', {
                                                        method: 'POST',
                                                        body: data,
                                                    });
                                                    if (!res.ok) throw new Error('Upload failed');
                                                    const result = await res.json();
                                                    setFormData(prev => ({ ...prev, thumbnailUrl: result.url }));
                                                    setThumbnailPreview(result.url);
                                                } catch (error) {
                                                    console.error('Thumbnail upload error:', error);
                                                    alert('Failed to upload thumbnail');
                                                } finally {
                                                    setUploadingThumbnail(false);
                                                }
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {uploadingThumbnail ? (
                                            <div className="flex flex-col items-center">
                                                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                                <p className="text-sm">Uploading...</p>
                                            </div>
                                        ) : thumbnailPreview ? (
                                            <div className="flex flex-col items-center">
                                                <img src={thumbnailPreview} alt="Thumbnail" className="max-h-24 rounded mb-2" />
                                                <p className="text-xs text-green-600">Thumbnail uploaded</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">PNG, JPG, WebP (max 5MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="card p-6">
                            <h2 className="font-semibold text-foreground mb-4">Additional Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">University</label>
                                    <input
                                        type="text"
                                        value={formData.university}
                                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                        placeholder="e.g., BEU, AKTU"
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Semester</label>
                                    <select
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        className="input"
                                    >
                                        <option value="">Select Semester</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                            <option key={sem} value={sem}>{sem}st/nd/rd/th Semester</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Branch</label>
                                    <select
                                        value={formData.branch}
                                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                        className="input"
                                    >
                                        <option value="">Select Branch</option>
                                        {BRANCHES.map((branch) => (
                                            <option key={branch.slug} value={branch.slug}>{branch.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="e.g., Data Structures"
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Exam Type</label>
                                    <input
                                        type="text"
                                        value={formData.examType}
                                        onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                                        placeholder="e.g., GATE, SSC"
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                                    <select
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                        className="input"
                                    >
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Bilingual">Bilingual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Number of Pages</label>
                                    <input
                                        type="number"
                                        value={formData.pages}
                                        onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                        placeholder="e.g., 150"
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="e.g., gate, cse, algorithms"
                                        className="input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Card */}
                        <div className="card p-6">
                            <h2 className="font-semibold text-foreground mb-4">Publish</h2>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPublished}
                                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="text-foreground">Publish immediately</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="text-foreground">Featured note</span>
                                </label>
                                <div className="pt-4 border-t border-border flex gap-3">
                                    <button type="button" className="btn-secondary flex-1">
                                        Save Draft
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || uploading}
                                        className="btn-primary flex-1 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="card p-6">
                            <h2 className="font-semibold text-foreground mb-4">Category</h2>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="input"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Pricing */}
                        <div className="card p-6">
                            <h2 className="font-semibold text-foreground mb-4">Pricing</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Regular Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0 for free"
                                        className="input"
                                        min="0"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Set to 0 for free notes</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Discount Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.discountPrice}
                                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                        placeholder="Optional"
                                        className="input"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview Settings */}
                        <div className="card p-6">
                            <h2 className="font-semibold text-foreground mb-4">Preview Settings</h2>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Preview Pages
                                </label>
                                <input
                                    type="number"
                                    value={formData.previewPages}
                                    onChange={(e) => setFormData({ ...formData, previewPages: e.target.value })}
                                    placeholder="5"
                                    className="input"
                                    min="1"
                                    max="20"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Number of pages visible in preview</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
