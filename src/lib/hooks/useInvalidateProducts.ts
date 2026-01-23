'use client';

import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = () => {
    // Invalidate all product-related queries
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const invalidateProduct = (productId: string) => {
    // Invalidate specific product queries
    queryClient.invalidateQueries({ queryKey: ['products', productId] });
  };

  const invalidateAllProductData = () => {
    invalidateProducts();
    // Invalidate any individual product queries
    queryClient.invalidateQueries({ queryKey: ['product'] });
  };

  return {
    invalidateProducts,
    invalidateProduct,
    invalidateAllProductData,
  };
};