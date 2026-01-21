import { prisma } from '@/lib/prisma/prisma';

export interface CartWithItems {
  id: string;
  userId: string;
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      title: string;
      thumbnail: string;
      price: number;
      discountPercentage: number;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export async function getCartByUserId(userId: string): Promise<CartWithItems | null> {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              price: true,
              discountPercentage: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
}

export async function getOrCreateCart(userId: string): Promise<CartWithItems> {
  const existingCart = await getCartByUserId(userId);
  
  if (existingCart) {
    return existingCart;
  }

  return prisma.cart.create({
    data: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              price: true,
              discountPercentage: true,
            },
          },
        },
      },
    },
  });
}

export async function addItemToCart(
  userId: string,
  productId: string,
  quantity: number = 1
) {
  // Get or create cart
  const cart = await getOrCreateCart(userId);

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    // Update quantity
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            price: true,
            discountPercentage: true,
          },
        },
      },
    });
  }

  // Create new cart item
  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          price: true,
          discountPercentage: true,
        },
      },
    },
  });
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  if (quantity <= 0) {
    return prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          price: true,
          discountPercentage: true,
        },
      },
    },
  });
}

export async function removeItemFromCart(cartItemId: string) {
  return prisma.cartItem.delete({
    where: { id: cartItemId },
  });
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    return null;
  }

  // Delete all cart items
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return cart;
}

export async function getCartItemByProductId(userId: string, productId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    return null;
  }

  return prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });
}
