import axios from 'axios';
import type { Category, PaginatedResponse, Product } from '../types';

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ProductQueryParams {
  category?: string;
  metal_type?: string;
  price_min?: number;
  price_max?: number;
  ordering?: string;
  search?: string;
  page?: number;
}

export async function getProducts(
  params?: ProductQueryParams
): Promise<PaginatedResponse<Product>> {
  const response = await client.get<PaginatedResponse<Product>>('/products/', { params });
  return response.data;
}

export async function getProduct(slug: string): Promise<Product> {
  const response = await client.get<Product>(`/products/${slug}/`);
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await client.get<Category[]>('/categories/');
  return response.data;
}

export default client;
