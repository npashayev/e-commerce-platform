import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCartByUserId, clearCart } from '@/lib/prisma/api/cart';
import { checkoutSchema } from '@/lib/validators/cart';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate Cart Empty
    const cart = await getCartByUserId(session.user.id);
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate Body
    const body = await req.json();
    const validationResult = checkoutSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          fieldErrors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    //
    // Payment step is passed here for demo purposes
    //

    await clearCart(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully! Thank you for your purchase.',
    });
  } catch (error) {
    console.error('API Error (POST /api/checkout):', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
