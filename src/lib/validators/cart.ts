import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer').default(1),
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string().min(1, 'Cart item ID is required'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

export const removeCartItemSchema = z.object({
  cartItemId: z.string().min(1, 'Cart item ID is required'),
});

// Checkout form validation with realistic card validation
export const checkoutSchema = z.object({
  cardholderName: z
    .string()
    .min(2, 'Cardholder name must be at least 2 characters')
    .max(100, 'Cardholder name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Cardholder name can only contain letters and spaces'),
  
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .transform((val) => val.replace(/\s+/g, '')) // Remove spaces
    .refine((val) => /^\d{13,19}$/.test(val), 'Card number must be 13-19 digits')
    .refine((val) => luhnCheck(val), 'Invalid card number'),
  
  expirationDate: z
    .string()
    .min(1, 'Expiration date is required')
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Expiration date must be in MM/YY format')
    .refine((val) => {
      const [month, year] = val.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      now.setDate(1); // Set to first of month for comparison
      return expiry >= now;
    }, 'Card has expired'),
  
  cvv: z
    .string()
    .min(1, 'CVV is required')
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

// Luhn algorithm for card number validation
function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
