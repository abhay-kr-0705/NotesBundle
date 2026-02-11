const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const publicId = 'notesbundle/previews/preview-1770792120697-RRBNTPCGAPart1CompletePolityFINAL.pdf';
const timestamp = Math.floor(Date.now() / 1000) + 3600;

const types = ['upload', 'authenticated', 'private'];

console.log('--- Generating Signed URLs ---');

types.forEach(type => {
    const url = cloudinary.url(publicId, {
        resource_type: 'raw',
        sign_url: true,
        type: type,
        expires_at: timestamp,
    });
    console.log(`Type: ${type}`);
    console.log(`URL: ${url}`);
    console.log('---');
});
