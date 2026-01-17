import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { deleteImagesFromCloudinary } from '@/lib/utils/cloudinary';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to delete (admin/moderator)
    if (session.user.role !== 'admin' && session.user.role !== 'moderator') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 },
      );
    }

    // Get public IDs from request body
    const { publicIds } = await request.json();

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json(
        { error: 'Public IDs array is required' },
        { status: 400 },
      );
    }

    // Delete images using the utility function
    const result = await deleteImagesFromCloudinary(publicIds);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete images' },
      { status: 500 },
    );
  }
}
