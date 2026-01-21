import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  getCartByUserId,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
} from '@/lib/prisma/api/cart';
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from '@/lib/validators/cart';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await getCartByUserId(session.user.id);

    if (!cart) {
      return NextResponse.json({
        cart: null,
        products: [],
        totalPrice: 0,
        totalProducts: 0,
        totalQuantity: 0,
      });
    }

    const products = cart.items.map(item => {
      const discountedPrice =
        item.product.price * (1 - item.product.discountPercentage / 100);
      return {
        id: item.product.id,
        cartItemId: item.id,
        title: item.product.title,
        thumbnail: item.product.thumbnail,
        price: item.product.price,
        discountPercentage: item.product.discountPercentage,
        quantity: item.quantity,
        totalPrice: parseFloat((discountedPrice * item.quantity).toFixed(2)),
      };
    });

    const totalPrice = parseFloat(
      products.reduce((sum, p) => sum + p.totalPrice, 0).toFixed(2),
    );
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

    return NextResponse.json({
      cart,
      products,
      totalPrice,
      totalProducts,
      totalQuantity,
    });
  } catch (error) {
    console.error('API Error (GET /api/cart):', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = addToCartSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 },
      );
    }

    const { productId, quantity } = validationResult.data;
    const result = await addItemToCart(session.user.id, productId, quantity);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('API Error (POST /api/cart):', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = updateCartItemSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 },
      );
    }

    const { cartItemId, quantity } = validationResult.data;
    const result = await updateCartItemQuantity(cartItemId, quantity);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error (PUT /api/cart):', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = removeCartItemSchema.safeParse(body);

    if (!validationResult.success) {
      const { searchParams } = new URL(req.url);
      const cartItemId = searchParams.get('cartItemId');
      if (cartItemId) {
        await removeItemFromCart(cartItemId);
        return NextResponse.json({ success: true });
      }

      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 },
      );
    }

    const { cartItemId } = validationResult.data;
    await removeItemFromCart(cartItemId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error (DELETE /api/cart):', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
