import { useState } from 'react';

interface UploadResponse {
  secure_url: string;
  public_id: string;
}

export const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    setIsUploading(true);

    try {
      // Get signature from our secure API
      const signatureResponse = await fetch('/api/cloudinary-signature', {
        method: 'POST',
      });

      if (!signatureResponse.ok) {
        const error = await signatureResponse.json();
        throw new Error(error.error || 'Failed to get upload signature');
      }

      const { signature, timestamp, cloudName, apiKey, folder } =
        await signatureResponse.json();

      // Upload each file to Cloudinary
      const uploadPromises = files.map(async file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', apiKey);
        formData.append('folder', folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data: UploadResponse = await response.json();
        return data.secure_url;
      });

      // Upload all images in parallel
      const uploadedUrls = await Promise.all(uploadPromises);

      return uploadedUrls;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImages, isUploading };
};
