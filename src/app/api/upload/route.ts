import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Only PDF files are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size must be less than 50MB' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filenames
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const fileName = `${timestamp}-${originalName}`;
        const previewName = `${timestamp}-preview-${originalName}`;

        // Ensure directories exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'notes');
        const previewDir = path.join(process.cwd(), 'public', 'uploads', 'previews');

        await mkdir(uploadDir, { recursive: true });
        await mkdir(previewDir, { recursive: true });

        // Save original file
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        // Generate preview (first 5 pages)
        let previewPath = '';
        try {
            const pdfDoc = await PDFDocument.load(bytes);
            const previewDoc = await PDFDocument.create();

            const pageCount = pdfDoc.getPageCount();
            const pagesToCopy = Math.min(pageCount, 5);

            const copiedPages = await previewDoc.copyPages(pdfDoc, Array.from({ length: pagesToCopy }, (_, i) => i));

            copiedPages.forEach((page) => {
                previewDoc.addPage(page);
            });

            const previewBytes = await previewDoc.save();
            previewPath = path.join(previewDir, previewName);
            await writeFile(previewPath, previewBytes);
        } catch (previewError) {
            console.error('Error generating preview:', previewError);
            // If preview fails, just use the original file as preview or handle gracefully
            // For now, we'll continue without a specific preview file
        }

        // Construct public URLs
        const fileUrl = `/uploads/notes/${fileName}`;
        const previewUrl = previewPath ? `/uploads/previews/${previewName}` : fileUrl;

        return NextResponse.json({
            success: true,
            fileUrl,
            previewUrl,
            fileName: originalName,
            size: file.size
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'File upload failed' },
            { status: 500 }
        );
    }
}
