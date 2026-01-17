import { z } from 'zod';

export const updateProductSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  brand: z.string().optional(),
  price: z.number().positive().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  weight: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  depth: z.number().positive().optional(),
  warrantyInformation: z.string().optional(),
  shippingInformation: z.string().optional(),
  returnPolicy: z.string().optional(),
  minimumOrderQuantity: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
