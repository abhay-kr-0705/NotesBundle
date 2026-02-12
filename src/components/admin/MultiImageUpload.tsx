'use client';

import { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface MultiImageUploadProps {
    images: string[];
    onImagesChange: (newImages: string[]) => void;
    label?: string;
    description?: string;
}

export default function MultiImageUpload({
    images = [],
    onImagesChange,
    label = "Preview Images",
    description = "Upload multiple images for manual preview"
}: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages: string[] = [];

        try {
            // Upload files sequentially or in parallel
            const uploadPromises = Array.from(files).map(async (file) => {
                if (!file.type.startsWith('image/')) return null;

                const data = new FormData();
                data.append('file', file);

                const res = await fetch('/api/upload/image', {
                    method: 'POST',
                    body: data,
                });

                if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
                const result = await res.json();
                return result.url;
            });

            const results = await Promise.all(uploadPromises);
            const validUrls = results.filter((url): url is string => url !== null);

            if (validUrls.length > 0) {
                onImagesChange([...images, ...validUrls]);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload some images');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        onImagesChange(images.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
                <p className="text-sm text-muted-foreground mb-3">{description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {images.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-slate-100 dark:bg-slate-800">
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Page {index + 1}
                        </div>
                    </div>
                ))}

                {/* Upload Button */}
                <div className="border-2 border-dashed border-border rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors relative">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground font-medium">Add Images</span>
                        </>
                    )}
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                Drag and drop to reorder support coming soon. Currently uploads append to the end.
            </p>
        </div>
    );
}
