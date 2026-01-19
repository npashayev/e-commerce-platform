import { Category, Product, Review } from '@prisma/client';
import { apiFetch } from './apiFetch';

export async function getProducts(category?: string, sortBy?: string, order?: string) {
  const params = new URLSearchParams();

  if (category) params.set('category', category);
  if (sortBy) params.set('sortBy', sortBy);
  if (order) params.set('order', order);

  const queryString = params.toString();
  const url = queryString ? `/products?${queryString}` : '/products';

  return apiFetch<Product[]>(url);
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
