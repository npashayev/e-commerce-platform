import type { Category, Product, Review } from '@prisma/client';
import { apiFetch } from './apiFetch';
import apiClient from './apiClient';

// Types for paginated products response
export interface PaginatedProductsResponse {
  products: Product[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export interface GetProductsParams {
  category?: string;
  sortBy?: string;
  order?: string;
  cursor?: string;
  limit?: number;
  search?: string;
}

// Client-side fetch for products (used with React Query)
export const getProducts = (params: GetProductsParams) =>
  apiClient
    .get<PaginatedProductsResponse>('/products', { params })
    .then((res) => res.data);

// Server-side fetch for initial data (used in server components)
export async function getProductsServer(
  category?: string,
  sortBy?: string,
  order?: string,
  search?: string
) {
  const params = new URLSearchParams();

  if (category) params.set('category', category);
  if (sortBy) params.set('sortBy', sortBy);
  if (order) params.set('order', order);
  if (search) params.set('search', search);

  const queryString = params.toString();
  const url = queryString ? `/products?${queryString}` : '/products';

  return apiFetch<PaginatedProductsResponse>(url);
}

export async function getProductById(id: string) {
  return apiFetch<Product>(`/products/${id}`);
}

export async function getReviewsByProductId(productId: string) {
  return apiFetch<Review[]>(`/reviews/${productId}`);
}

export async function getCategories() {
  return apiFetch<Category[]>('/categories');
}
