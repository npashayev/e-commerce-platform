import { NextRequest, NextResponse } from 'next/server';
import {
  getProductByIdFromDB,
  updateProductInDB,
  deleteProductFromDB,
} from '@/lib/prisma/api/products';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  UpdateProductInput,
  updateProductSchema,
} from '@/lib/validators/products';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';


interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: 'Product ID is required' },
      { status: 400 },
    );
  }

  try {
    const product = await getProductByIdFromDB(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('[GET_PRODUCT_BY_ID_ERROR]', { error, productId: id });

    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      (session.user.role !== 'admin' && session.user.role !== 'moderator')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get product ID from URL params
    const { id } = await context.params;

    // Get request body
    const body = await request.json();

    // Validate with Zod
    const validationResult = updateProductSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const validatedData: UpdateProductInput = validationResult.data;

    // Build update data with proper Prisma type
    const updateData: Prisma.ProductUpdateInput = {};

    // Check if any fields are being updated
    const hasUpdates = Object.values(validatedData).some(
      value => value !== undefined && value !== null,
    );

    if (!hasUpdates) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 },
      );
    }

    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
    }
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description;
    }
    if (validatedData.category !== undefined) {
      updateData.category = validatedData.category;
    }
    if (validatedData.brand !== undefined) {
      updateData.brand = validatedData.brand;
    }
    if (validatedData.price !== undefined) {
      updateData.price = validatedData.price;
    }
    if (validatedData.discountPercentage !== undefined) {
      updateData.discountPercentage = validatedData.discountPercentage;
    }
    if (validatedData.weight !== undefined) {
      updateData.weight = validatedData.weight;
    }
    if (validatedData.warrantyInformation !== undefined) {
      updateData.warrantyInformation = validatedData.warrantyInformation;
    }
    if (validatedData.shippingInformation !== undefined) {
      updateData.shippingInformation = validatedData.shippingInformation;
    }
    if (validatedData.returnPolicy !== undefined) {
      updateData.returnPolicy = validatedData.returnPolicy;
    }
    if (validatedData.minimumOrderQuantity !== undefined) {
      updateData.minimumOrderQuantity = validatedData.minimumOrderQuantity;
    }
    if (validatedData.tags !== undefined) {
      updateData.tags = validatedData.tags;
    }
    if (validatedData.images !== undefined) {
      updateData.images = validatedData.images;
    }

    // Handle dimensions separately
    if (
      validatedData.width !== undefined ||
      validatedData.height !== undefined ||
      validatedData.depth !== undefined
    ) {
      updateData.dimensions = {
        width: validatedData.width ?? 0,
        height: validatedData.height ?? 0,
        depth: validatedData.depth ?? 0,
      };
    }

    // Update product using prisma function
    const updatedProduct = await updateProductInDB(id, updateData);

    // Revalidate product pages to clear cache
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    revalidatePath(`/admin/products/${id}/update`);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);

    // Type guard for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get product ID from URL params
    const { id } = await context.params;

    // Check if product exists
    const product = await getProductByIdFromDB(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 },
      );
    }

    // Delete associated images from Cloudinary if they exist
    if (product.images && product.images.length > 0) {
      try {
        // Extract public IDs from Cloudinary URLs
        const publicIds = product.images
          .map((url: string) => {
            // Extract public ID from Cloudinary URL
            const matches = url.match(/\/v\d+\/(.+)\.[a-z]+$/);
            return matches ? matches[1] : null;
          })
          .filter(Boolean) as string[];

        if (publicIds.length > 0) {
          console.log('Attempting to delete product images from Cloudinary:', publicIds);

          // Import the delete function
          const { deleteImagesFromCloudinary } = await import('@/lib/utils/cloudinary');
          const deleteResult = await deleteImagesFromCloudinary(publicIds);

          console.log('Cloudinary deletion result:', {
            deleted: deleteResult.deleted,
            failed: deleteResult.failed,
          });

          if (deleteResult.failed > 0) {
            console.warn(`Failed to delete ${deleteResult.failed} product images from Cloudinary`);
          }
        }
      } catch (error) {
        console.warn('Error deleting product images from Cloudinary:', error);
        // Don't fail the deletion if image cleanup fails
      }
    }

    // Delete product from database
    await deleteProductFromDB(id);

    // Revalidate product pages to clear cache
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    revalidatePath('/admin/products');
    revalidatePath('/admin');

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);

    // Type guard for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 },
    );
  }
}
