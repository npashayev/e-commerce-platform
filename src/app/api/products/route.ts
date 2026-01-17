import { fetchProductsFromDB, createProductInDB } from '@/lib/prisma/api/products';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  CreateProductInput,
  createProductSchema,
} from '@/lib/validators/products';
import { Prisma } from '@prisma/client';


export async function GET() {
  try {
    const products = await fetchProductsFromDB();
    return NextResponse.json(products);
  } catch (error) {
    console.error('[GET_PRODUCTS_ERROR]', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is admin or moderator
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      (session.user.role !== 'admin' && session.user.role !== 'moderator')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();

    // Validate with Zod
    const validationResult = createProductSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: validationResult.error.issues,
        },
        { status: 400 },
      );
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
    const createdProduct = await createProductInDB(createData);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: createdProduct,
    });
  } catch (error) {
    console.error('Create product error:', error);

    // Type guard for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A product with this information already exists' },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 },
    );
  }
}
