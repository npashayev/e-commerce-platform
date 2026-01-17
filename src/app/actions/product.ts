'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  UpdateProductInput,
  updateProductSchema,
  CreateProductInput,
  createProductSchema,
} from '@/lib/validators/products';
import {
  updateProductInDB,
  getProductByIdFromDB,
  createProductInDB,
  deleteProductFromDB,
} from '@/lib/prisma/api/products';
import {
  deleteImagesFromCloudinary,
  extractPublicIdFromUrl,
} from '@/lib/utils/cloudinary';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

interface UpdateProductState {
  success?: boolean;
  error?: string;
  message?: string;
  issues?: z.ZodIssue[];
}

interface AddProductState {
  success?: boolean;
  error?: string;
  message?: string;
  issues?: z.ZodIssue[];
}

export async function updateProductAction(
  prevState: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      (session.user.role !== 'admin' && session.user.role !== 'moderator')
    ) {
      return {
        error: 'Unauthorized',
      };
    }

    const productId = formData.get('productId') as string;

    // Fetch original product data to compare images
    const originalProduct = await getProductByIdFromDB(productId);
    if (!originalProduct) {
      return {
        error: 'Product not found',
      };
    }

    // Extract all fields from FormData
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const price = formData.get('price')
      ? parseFloat(formData.get('price') as string)
      : undefined;
    const discountPercentage = formData.get('discountPercentage')
      ? parseFloat(formData.get('discountPercentage') as string)
      : undefined;
    const weight = formData.get('weight')
      ? parseFloat(formData.get('weight') as string)
      : undefined;
    const width = formData.get('width')
      ? parseFloat(formData.get('width') as string)
      : undefined;
    const height = formData.get('height')
      ? parseFloat(formData.get('height') as string)
      : undefined;
    const depth = formData.get('depth')
      ? parseFloat(formData.get('depth') as string)
      : undefined;
    const warrantyInformation = formData.get('warrantyInformation') as string;
    const shippingInformation = formData.get('shippingInformation') as string;
    const returnPolicy = formData.get('returnPolicy') as string;
    const minimumOrderQuantity = formData.get('minimumOrderQuantity')
      ? parseInt(formData.get('minimumOrderQuantity') as string)
      : undefined;

    // Parse JSON fields
    const tagsJson = formData.get('tags') as string;
    const tags = tagsJson ? JSON.parse(tagsJson) : undefined;

    const imagesJson = formData.get('images') as string;
    const newImages = imagesJson ? JSON.parse(imagesJson) : undefined;

    // Handle image deletion: compare original vs new images
    if (newImages !== undefined) {
      const originalImageUrls = originalProduct.images || [];
      const removedImages = originalImageUrls.filter(
        (originalUrl: string) => !newImages.includes(originalUrl),
      );

      // Delete removed images from Cloudinary
      if (removedImages.length > 0) {
        try {
          // Extract public IDs from Cloudinary URLs
          const publicIds = removedImages
            .map((url: string) => extractPublicIdFromUrl(url))
            .filter(Boolean) as string[];

          console.log(
            'Attempting to delete images from Cloudinary:',
            publicIds,
          );

          const deleteResult = await deleteImagesFromCloudinary(publicIds);

          console.log('Cloudinary deletion result:', {
            deleted: deleteResult.deleted,
            failed: deleteResult.failed,
            results: deleteResult.results,
          });

          if (deleteResult.failed > 0) {
            console.warn(
              `Failed to delete ${deleteResult.failed} images from Cloudinary`,
            );
          }
        } catch (error) {
          console.warn('Error deleting images from Cloudinary:', error);
        }
      }
    }

    // Build request body (only include defined fields)
    const requestBody: Record<string, unknown> = {};

    if (title) requestBody.title = title;
    if (description) requestBody.description = description;
    if (category) requestBody.category = category;
    if (brand !== null) requestBody.brand = brand;
    if (price !== undefined) requestBody.price = price;
    if (discountPercentage !== undefined)
      requestBody.discountPercentage = discountPercentage;
    if (weight !== undefined) requestBody.weight = weight;
    if (width !== undefined) requestBody.width = width;
    if (height !== undefined) requestBody.height = height;
    if (depth !== undefined) requestBody.depth = depth;
    if (warrantyInformation)
      requestBody.warrantyInformation = warrantyInformation;
    if (shippingInformation)
      requestBody.shippingInformation = shippingInformation;
    if (returnPolicy) requestBody.returnPolicy = returnPolicy;
    if (minimumOrderQuantity !== undefined)
      requestBody.minimumOrderQuantity = minimumOrderQuantity;
    if (tags) requestBody.tags = tags;
    if (newImages) requestBody.images = newImages;

    // Check if any fields are being updated
    if (Object.keys(requestBody).length === 0) {
      return {
        error: 'No changes detected',
      };
    }

    // Validate with Zod
    const validationResult = updateProductSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return {
        error: 'Validation failed',
        issues: validationResult.error.issues,
      };
    }

    const validatedData: UpdateProductInput = validationResult.data;

    // Build update data with proper Prisma type
    const updateData: Prisma.ProductUpdateInput = {};

    // Check if any fields are being updated
    const hasUpdates = Object.values(validatedData).some(
      value => value !== undefined && value !== null,
    );

    if (!hasUpdates) {
      return {
        error: 'No valid updates provided',
      };
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
    await updateProductInDB(productId, updateData);

    // Revalidate relevant pages
    revalidatePath('/products');
    revalidatePath(`/products/${productId}`);
    revalidatePath(`/admin/products/${productId}/update`);

    // Redirect after successful update
    redirect(`/products/${productId}`);
  } catch (error) {
    console.error('Server action error:', error);

    // Handle NEXT_REDIRECT error (thrown by redirect function)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw redirect errors so Next.js can handle them
    }

    // Type guard for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return {
          error: 'Product not found',
        };
      }
    }

    return {
      error: 'An unexpected error occurred',
    };
  }
}

export async function addProductAction(
  prevState: AddProductState,
  formData: FormData,
): Promise<AddProductState> {
  try {
    // Check authentication and authorization (admin or moderator)
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      (session.user.role !== 'admin' && session.user.role !== 'moderator')
    ) {
      return {
        error: 'Unauthorized. Only admins and moderators can add products.',
      };
    }

    // Extract all fields from FormData
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const price = formData.get('price')
      ? parseFloat(formData.get('price') as string)
      : undefined;
    const discountPercentage = formData.get('discountPercentage')
      ? parseFloat(formData.get('discountPercentage') as string)
      : undefined;
    const weight = formData.get('weight')
      ? parseFloat(formData.get('weight') as string)
      : undefined;
    const width = formData.get('width')
      ? parseFloat(formData.get('width') as string)
      : undefined;
    const height = formData.get('height')
      ? parseFloat(formData.get('height') as string)
      : undefined;
    const depth = formData.get('depth')
      ? parseFloat(formData.get('depth') as string)
      : undefined;
    const warrantyInformation = formData.get('warrantyInformation') as string;
    const shippingInformation = formData.get('shippingInformation') as string;
    const returnPolicy = formData.get('returnPolicy') as string;
    const minimumOrderQuantity = formData.get('minimumOrderQuantity')
      ? parseInt(formData.get('minimumOrderQuantity') as string)
      : undefined;

    // Parse JSON fields
    const tagsJson = formData.get('tags') as string;
    const tags = tagsJson ? JSON.parse(tagsJson) : undefined;

    const imagesJson = formData.get('images') as string;
    const images = imagesJson ? JSON.parse(imagesJson) : undefined;

    // Build request body (only include defined fields)
    const requestBody: Record<string, unknown> = {};

    if (title) requestBody.title = title;
    if (description) requestBody.description = description;
    if (category) requestBody.category = category;
    if (brand !== null) requestBody.brand = brand;
    if (price !== undefined) requestBody.price = price;
    if (discountPercentage !== undefined)
      requestBody.discountPercentage = discountPercentage;
    if (weight !== undefined) requestBody.weight = weight;
    if (width !== undefined) requestBody.width = width;
    if (height !== undefined) requestBody.height = height;
    if (depth !== undefined) requestBody.depth = depth;
    if (warrantyInformation)
      requestBody.warrantyInformation = warrantyInformation;
    if (shippingInformation)
      requestBody.shippingInformation = shippingInformation;
    if (returnPolicy) requestBody.returnPolicy = returnPolicy;
    if (minimumOrderQuantity !== undefined)
      requestBody.minimumOrderQuantity = minimumOrderQuantity;
    if (tags) requestBody.tags = tags;
    if (images) requestBody.images = images;

    // Validate with Zod
    const validationResult = createProductSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return {
        error: 'Validation failed',
        issues: validationResult.error.issues,
      };
    }

    const validatedData: CreateProductInput = validationResult.data;

    // Build create data with proper Prisma type
    const createData: Prisma.ProductCreateInput = {
      title: validatedData.title,
      description: validatedData.description || '',
      category: validatedData.category,
      price: validatedData.price,
      // Required fields with defaults
      rating: 0,
      stock: 0,
      sku: `${validatedData.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
      availabilityStatus: 'Out of Stock',
      thumbnail: validatedData.images?.[0] || '',
      // Optional fields
      ...(validatedData.brand && { brand: validatedData.brand }),
      discountPercentage: validatedData.discountPercentage ?? 0,
      weight: validatedData.weight ?? 0,
      warrantyInformation: validatedData.warrantyInformation || '',
      shippingInformation: validatedData.shippingInformation || '',
      returnPolicy: validatedData.returnPolicy || '',
      minimumOrderQuantity: validatedData.minimumOrderQuantity ?? 1,
      ...(validatedData.tags && { tags: validatedData.tags }),
      ...(validatedData.images && { images: validatedData.images }),
      // Handle dimensions separately
      dimensions: {
        width: validatedData.width ?? 0,
        height: validatedData.height ?? 0,
        depth: validatedData.depth ?? 0,
      }
    };

    // Create product using prisma function
    await createProductInDB(createData);

    // Revalidate relevant pages
    revalidatePath('/products');

    // Redirect after successful creation
    redirect('/products');
  } catch (error) {
    console.error('Add product server action error:', error);

    // Handle NEXT_REDIRECT error (thrown by redirect function)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw redirect errors so Next.js can handle them
    }

    // Type guard for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          error: 'A product with this information already exists',
        };
      }
    }

    return {
      error: 'An unexpected error occurred while adding the product',
    };
  }
}

interface DeleteProductState {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function deleteProductAction(
  productId: string,
): Promise<DeleteProductState> {
  try {
    // Check authentication and authorization (admin only)
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return {
        error: 'Unauthorized. Only admins can delete products.',
      };
    }

    // Fetch product to check if it exists and get image URLs
    const product = await getProductByIdFromDB(productId);
    if (!product) {
      return {
        error: 'Product not found',
      };
    }

    // Delete associated images from Cloudinary if they exist
    if (product.images && product.images.length > 0) {
      try {
        // Extract public IDs from Cloudinary URLs
        const publicIds = product.images
          .map((url: string) => extractPublicIdFromUrl(url))
          .filter(Boolean) as string[];

        if (publicIds.length > 0) {
          console.log('Attempting to delete product images from Cloudinary:', publicIds);

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
    await deleteProductFromDB(productId);

    // Revalidate relevant pages
    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/admin');

    // Redirect to products list after successful deletion
    redirect('/products');
  } catch (error) {
    console.error('Delete product server action error:', error);

    // Handle NEXT_REDIRECT error (thrown by redirect function)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw redirect errors so Next.js can handle them
    }

    // Type guard for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return {
          error: 'Product not found',
        };
      }
    }

    return {
      error: 'An unexpected error occurred while deleting the product',
    };
  }
}
