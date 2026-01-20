import { fetchProductsPaginated, createProductInDB } from '@/lib/prisma/api/products';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  CreateProductInput,
  createProductSchema,
} from '@/lib/validators/products';
import { Prisma } from '@prisma/client';

const DEFAULT_INITIAL_LIMIT = 50;
const DEFAULT_PAGE_LIMIT = 30;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const order = searchParams.get('order') || undefined;
    const cursor = searchParams.get('cursor') || undefined;
    const limitParam = searchParams.get('limit');
    const search = searchParams.get('search') || undefined;
    
    // Use paginated fetch if cursor or limit is provided (infinite scroll mode)
    // First request gets 50 items, subsequent requests get 30
    const limit = limitParam 
      ? parseInt(limitParam, 10) 
      : cursor 
        ? DEFAULT_PAGE_LIMIT 
        : DEFAULT_INITIAL_LIMIT;

    const result = await fetchProductsPaginated({
      category,
      sortBy,
      order,
      cursor,
      limit,
      search,
    });
    
    return NextResponse.json(result);
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
