import axios from 'axios';
import type { AuthUser, Cart, CartItem, Category, CustomerProfile, Order, PaginatedResponse, Product } from '../types';

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authenticated axios instance — reads token from localStorage on every request
const authClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
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

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<{ access: string; refresh: string }> {
  const response = await client.post<{ access: string; refresh: string }>(
    '/auth/login/',
    { email, password }
  );
  return response.data;
}

export async function register(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<{ access: string; refresh: string; user: AuthUser }> {
  const response = await client.post<{ access: string; refresh: string; user: AuthUser }>(
    '/auth/register/',
    data
  );
  return response.data;
}

export async function getProfile(): Promise<CustomerProfile> {
  const response = await authClient.get<CustomerProfile>('/auth/profile/');
  return response.data;
}

export async function updateProfile(data: Partial<CustomerProfile>): Promise<CustomerProfile> {
  const response = await authClient.patch<CustomerProfile>('/auth/profile/', data);
  return response.data;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export async function getCart(): Promise<Cart> {
  const response = await authClient.get<Cart>('/cart/');
  return response.data;
}

export async function addToCart(productId: number, quantity: number): Promise<Cart> {
  const response = await authClient.post<Cart>('/cart/', {
    product: productId,
    quantity,
  });
  return response.data;
}

export async function updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
  const response = await authClient.put<CartItem>(`/cart/${itemId}/`, { quantity });
  return response.data;
}

export async function removeCartItem(itemId: number): Promise<void> {
  await authClient.delete(`/cart/${itemId}/`);
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function placeOrder(data: {
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_postcode: string;
  payment_method: string;
  notes?: string;
}): Promise<Order> {
  const response = await authClient.post<Order>('/orders/', data);
  return response.data;
}

export async function getOrders(): Promise<Order[]> {
  const response = await authClient.get<Order[]>('/orders/');
  return response.data;
}

export async function getOrder(id: number): Promise<Order> {
  const response = await authClient.get<Order>(`/orders/${id}/`);
  return response.data;
}

export default client;
