import { Category, Product, Review } from '@prisma/client';
import { apiFetch } from './apiFetch';

export async function getProducts(category?: string) {
  const url = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
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
