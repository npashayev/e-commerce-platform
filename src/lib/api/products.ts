import { Category, Product, Review } from '@prisma/client';
import { apiFetch } from './apiFetch';

export async function getProducts() {
  return apiFetch<Product[]>('/products');
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
