import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

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

        // Create unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '').replace('.pdf', '');
        const publicId = `${timestamp}-${originalName}.pdf`;

        // Upload original file to Cloudinary
        const uploadResult = await uploadToCloudinary(buffer, {
            folder: 'notesbundle/notes',
            publicId,
            type: 'upload',
        });

        // Generate preview (first 5 pages)
        let previewUrl = uploadResult.secure_url;
        let pageCount = 0;

        try {
            const pdfDoc = await PDFDocument.load(bytes);
            pageCount = pdfDoc.getPageCount();

            const previewDoc = await PDFDocument.create();
            const pagesToCopy = Math.min(pageCount, 5);

            const copiedPages = await previewDoc.copyPages(
                pdfDoc,
                Array.from({ length: pagesToCopy }, (_, i) => i)
            );

            copiedPages.forEach((page) => {
                previewDoc.addPage(page);
            });

            const previewBytes = await previewDoc.save();
            const previewBuffer = Buffer.from(previewBytes);

            // Upload preview to Cloudinary
            const previewResult = await uploadToCloudinary(previewBuffer, {
                folder: 'notesbundle/previews',
                publicId: `preview-${publicId}`,
                // resourceType: 'raw', // Default is raw/auto which is better for PDFs
                type: 'upload', // Force public access
            });

            previewUrl = previewResult.secure_url;
        } catch (previewError) {
            console.error('Error generating preview:', previewError);
            // If preview fails, use original file URL
        }

        return NextResponse.json({
            success: true,
            fileUrl: uploadResult.secure_url,
            previewUrl,
            fileName: file.name,
            size: file.size,
            publicId: uploadResult.public_id,
            pageCount,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'File upload failed' },
            { status: 500 }
        );
    }
}
