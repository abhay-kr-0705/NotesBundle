import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResult {
    secure_url: string;
    public_id: string;
    bytes: number;
    format: string;
    pages?: number;
}

/**
 * Upload a file to Cloudinary
 * @param buffer - File buffer
 * @param options - Upload options
 * @returns Upload result with secure URL
 */
export async function uploadToCloudinary(
    buffer: Buffer,
    options: {
        folder?: string;
        publicId?: string;
        resourceType?: 'auto' | 'image' | 'video' | 'raw';
    } = {}
): Promise<UploadResult> {
    const { folder = 'notesbundle', publicId, resourceType = 'raw' } = options;

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId,
                resource_type: resourceType,
                format: 'pdf',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                        bytes: result.bytes,
                        format: result.format,
                        pages: result.pages,
                    });
                } else {
                    reject(new Error('Upload failed - no result returned'));
                }
            }
        );

        uploadStream.end(buffer);
    });
}

/**
 * Delete a file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @param resourceType - Type of resource
 */
export async function deleteFromCloudinary(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'raw'
): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

/**
 * Generate a signed URL for private file access
 * @param publicId - Public ID of the file
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 */
export function generateSignedUrl(
    publicId: string,
    expiresIn: number = 3600
): string {
    const timestamp = Math.floor(Date.now() / 1000) + expiresIn;

    return cloudinary.url(publicId, {
        resource_type: 'raw',
        sign_url: true,
        type: 'authenticated',
        expires_at: timestamp,
    });
}

export default cloudinary;
