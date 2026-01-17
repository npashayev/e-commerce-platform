import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to upload (admin/moderator)
    if (session.user.role !== 'admin' && session.user.role !== 'moderator') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 },
      );
    }

    // Get Cloudinary configuration from environment
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary configuration missing' },
        { status: 500 },
      );
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: 'ecommerce-products', // Specify upload folder
      },
      apiSecret,
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder: 'ecommerce-products',
    });
  } catch (error) {
    console.error('Cloudinary signature error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 },
    );
  }
}
