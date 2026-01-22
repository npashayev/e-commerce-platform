'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  getCartByUserId,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
  getCartItemByProductId,
} from '@/lib/prisma/api/cart';
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  checkoutSchema,
} from '@/lib/validators/cart';
import { z } from 'zod';

export interface CartActionState {
  success?: boolean;
  error?: string;
  message?: string;
  timestamp?: number;
}

export interface CheckoutActionState {
  success?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

// Get current user's cart
export async function getCartAction() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: 'Please login to view your cart' };
    }

    const cart = await getCartByUserId(session.user.id);

    if (!cart) {
      return {
        cart: null,
        products: [],
        totalPrice: 0,
        totalProducts: 0,
        totalQuantity: 0,
      };
    }

    // Transform cart items to match the expected format
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

    return {
      cart,
      products,
      totalPrice,
      totalProducts,
      totalQuantity,
    };
  } catch (error) {
    console.error('Get cart error:', error);
    return { error: 'Failed to fetch cart' };
  }
}

// Add item to cart
export async function addToCartAction(
  _prevState: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        error: 'Please login to add items to cart',
        timestamp: Date.now(),
      };
    }

    const productId = formData.get('productId') as string;
    const quantityStr = formData.get('quantity') as string;
    const quantity = quantityStr ? parseInt(quantityStr, 10) : 1;

    const validationResult = addToCartSchema.safeParse({ productId, quantity });

    if (!validationResult.success) {
      return {
        error: validationResult.error.issues[0]?.message || 'Invalid input',
        timestamp: Date.now(),
      };
    }

    // Check if product already exists in cart
    const existingItem = await getCartItemByProductId(
      session.user.id,
      productId,
    );

    if (existingItem) {
      return {
        error: 'This product is already in your cart',
        timestamp: Date.now(),
      };
    }

    await addItemToCart(session.user.id, productId, quantity);

    revalidatePath('/me/cart');
    revalidatePath('/products');

    return {
      success: true,
      message: 'Item added to cart',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Add to cart error:', error);
    return { error: 'Failed to add item to cart', timestamp: Date.now() };
  }
}

// Update cart item quantity
export async function updateCartItemAction(
  _prevState: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: 'Please login to update cart' };
    }

    const cartItemId = formData.get('cartItemId') as string;
    const quantityStr = formData.get('quantity') as string;
    const quantity = parseInt(quantityStr, 10);

    const validationResult = updateCartItemSchema.safeParse({
      cartItemId,
      quantity,
    });

    if (!validationResult.success) {
      return {
        error: validationResult.error.issues[0]?.message || 'Invalid input',
      };
    }

    await updateCartItemQuantity(cartItemId, quantity);

    revalidatePath('/me/cart');

    return {
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
    };
  } catch (error) {
    console.error('Update cart error:', error);
    return { error: 'Failed to update cart' };
  }
}

// Remove item from cart
export async function removeCartItemAction(
  _prevState: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: 'Please login to update cart' };
    }

    const cartItemId = formData.get('cartItemId') as string;

    const validationResult = removeCartItemSchema.safeParse({ cartItemId });

    if (!validationResult.success) {
      return {
        error: validationResult.error.issues[0]?.message || 'Invalid input',
      };
    }

    await removeItemFromCart(cartItemId);

    revalidatePath('/me/cart');

    return {
      success: true,
      message: 'Item removed from cart',
    };
  } catch (error) {
    console.error('Remove cart item error:', error);
    return { error: 'Failed to remove item' };
  }
}

// Checkout action
export async function checkoutAction(
  _prevState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: 'Please login to checkout' };
    }

    // Get cart and check if it has items
    const cartData = await getCartAction();

    if ('error' in cartData && cartData.error) {
      return { error: cartData.error };
    }

    if (!cartData.products || cartData.products.length === 0) {
      return { error: 'Your cart is empty' };
    }

    // Extract and validate form data
    const cardholderName = formData.get('cardholderName') as string;
    const cardNumber = formData.get('cardNumber') as string;
    const expirationDate = formData.get('expirationDate') as string;
    const cvv = formData.get('cvv') as string;

    const validationResult = checkoutSchema.safeParse({
      cardholderName,
      cardNumber,
      expirationDate,
      cvv,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};

      validationResult.error.issues.forEach((issue: z.ZodIssue) => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(issue.message);
      });

      return {
        error: 'Please fix the validation errors',
        fieldErrors,
      };
    }

    //
    // Payment step is passed here for demo purposes
    //

    await clearCart(session.user.id);

    revalidatePath('/me/cart');

    return {
      success: true,
      message: 'Order placed successfully! Thank you for your purchase.',
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return { error: 'An error occurred during checkout' };
  }
}
