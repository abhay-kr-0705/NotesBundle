const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function checkUrl(url, description) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`[${description}] Status: ${response.status}`);
        return response.status === 200;
    } catch (error) {
        console.log(`[${description}] Error: ${error.message}`);
        return false;
    }
}

async function main() {
    try {
        // 1. Get Note Data
        const note = await prisma.note.findUnique({
            where: { id: 'cmlhq2i4u0003bogg350bywbz' },
            select: { id: true, title: true, previewUrl: true }
        });

        if (!note) {
            console.log('Note not found');
            return;
        }

        console.log('Stored Preview URL:', note.previewUrl);

        // Extract Public ID
        // URL format: https://res.cloudinary.com/<cloud_name>/raw/upload/v<version>/<public_id>
        // or just match from 'notesbundle/...'
        const parts = note.previewUrl.split('/upload/');
        if (parts.length < 2) {
            console.log('Could not parse public ID from URL');
            return;
        }

        // Remove version if present (v12345678/) and get the rest
        let path = parts[1];
        if (path.startsWith('v')) {
            const versionEnd = path.indexOf('/');
            if (versionEnd !== -1) {
                path = path.substring(versionEnd + 1);
            }
        }
        const publicId = path; // decoded public ID might need decodeURIComponent if it was encoded, but usually DB has raw
        console.log('Extracted Public ID:', publicId);

        // 2. Generate simplified signed URLs
        const timestamp = Math.floor(Date.now() / 1000) + 3600;

        // Construct manual signature for 'upload' type
        // signature = api_secret + timestamp + public_id
        // This is a manual test to verify Cloudinary's signature logic

        console.log('\n--- Manual Signature Test ---');
        const signatureBase = `timestamp=${timestamp}&public_id=${publicId}${process.env.CLOUDINARY_API_SECRET}`;
        const crypto = require('crypto');
        const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

        // Construct URL manually
        // https://res.cloudinary.com/<cloud_name>/image/upload/s--<signature>--/v<version>/<public_id>
        // Note: The s--...-- part is a base64 encoding of the signature, but api_sign_request returns hex.
        // Let's rely on the SDK but simplify.

        console.log('Generating standardized signed URL (upload type)...');
        const urlUpload = cloudinary.url(publicId, {
            resource_type: 'raw',
            type: 'upload',
            sign_url: true,
            secure: true,
            version: '1770795731' // using hardcoded version from DB URL for test
        });

        console.log(`Testing standardized 'upload': ${urlUpload}`);
        await checkUrl(urlUpload, 'Standard Upload');

        // Test with transformation (sometimes needed for PDF to view?)
        // Actually for 'raw' resource_type, transformations are limited.


    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
