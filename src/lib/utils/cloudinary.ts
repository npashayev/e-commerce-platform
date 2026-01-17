import { v2 as cloudinary } from 'cloudinary';

// Cloudinary destroy response type
export interface CloudinaryDestroyResponse {
  result: 'ok' | 'not found' | 'error';
  rate_limit_allowed?: number;
  rate_limit_reset_at?: string;
  rate_limit_remaining?: number;
}

// Extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Cloudinary URLs typically look like:
    // https://res.cloudinary.com/{cloud_name}/image/upload/v{timestamp}/{public_id}.{format}
    const match = url.match(/\/upload\/(?:v\d+\/)?([^.]+)\.[a-zA-Z]+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

export interface DeleteResult {
  publicId: string;
  result?: CloudinaryDestroyResponse;
  error?: string;
}

export async function deleteImagesFromCloudinary(publicIds: string[]): Promise<{
  success: boolean;
  deleted: number;
  failed: number;
  results: DeleteResult[];
}> {
  if (publicIds.length === 0) {
    return {
      success: true,
      deleted: 0,
      failed: 0,
      results: [],
    };
  }

  // Get Cloudinary configuration from environment
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary configuration missing');
  }

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  // Delete images from Cloudinary
  const deletePromises = publicIds.map(async (publicId: string) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return { publicId, result };
    } catch (error) {
      console.error(`Failed to delete image ${publicId}:`, error);
      return { publicId, error: 'Failed to delete' };
    }
  });

  const deleteResults = await Promise.all(deletePromises);

  // Check for any failures
  const failures = deleteResults.filter(result => result.error);
  const successes = deleteResults.filter(result => !result.error);

  return {
    success: true,
    deleted: successes.length,
    failed: failures.length,
    results: deleteResults,
  };
}