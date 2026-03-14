import axios from 'axios';
import type { AuthUser, Cart, CartItem, Category, CustomerProfile, GoldPrices, Order, PaginatedResponse, Product, Review, WishlistItem } from '../types';

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
  payment_method: string;
  contact_phone?: string;
  recipient_name?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_postcode?: string;
  shipping_country?: string;
  shipping_cost?: number;
  notes?: string;
}): Promise<Order> {
  const response = await authClient.post<Order>('/orders/', data);
  return response.data;
}

export async function createStripeSession(orderId: number): Promise<{ url: string }> {
  const response = await authClient.post<{ url: string }>(`/orders/${orderId}/create-stripe-session/`);
  return response.data;
}

export async function confirmStripePayment(orderId: number, sessionId: string): Promise<{ status: string }> {
  const response = await authClient.post<{ status: string }>(`/orders/${orderId}/confirm-stripe/`, { session_id: sessionId });
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

// ── Enquiries ─────────────────────────────────────────────────────────────────

export async function submitEnquiry(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  product?: number;
}): Promise<{ id: number }> {
  const response = await client.post<{ id: number }>('/enquiries/', data);
  return response.data;
}

// ── Appointments ──────────────────────────────────────────────────────────────

export async function bookAppointment(data: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time_slot: string;
  purpose: string;
}): Promise<{ id: number }> {
  const response = await client.post<{ id: number }>('/appointments/', data);
  return response.data;
}

export default client;

// ── Reviews ───────────────────────────────────────────────────────────────────


export async function getProductReviews(productId: number): Promise<Review[]> {
  const response = await client.get<Review[]>(`/reviews/${productId}/`);
  return response.data;
}

export async function submitReview(data: {
  product: number;
  rating: number;
  title: string;
  text: string;
}): Promise<Review> {
  const response = await authClient.post<Review>('/reviews/', data);
  return response.data;
}

// ── Wishlist ──────────────────────────────────────────────────────────────────

export async function getWishlist(): Promise<WishlistItem[]> {
  const response = await authClient.get<WishlistItem[]>('/wishlist/');
  return response.data;
}

export async function toggleWishlist(productId: number): Promise<{ wishlisted: boolean }> {
  const response = await authClient.post<{ wishlisted: boolean }>(`/wishlist/toggle/${productId}/`);
  return response.data;
}

export async function checkWishlisted(productId: number): Promise<{ wishlisted: boolean }> {
  const response = await authClient.get<{ wishlisted: boolean }>(`/wishlist/toggle/${productId}/`);
  return response.data;
}

export async function removeWishlistItem(itemId: number): Promise<void> {
  await authClient.delete(`/wishlist/${itemId}/`);
}

// ── Gold Prices ───────────────────────────────────────────────────────────────

export async function getGoldPrices(): Promise<GoldPrices> {
  const response = await client.get<GoldPrices>('/gold-prices/');
  return response.data;
}


// ── Gold Buyback ──────────────────────────────────────────────────────────────

export async function submitBuyback(data: {
  name: string;
  email: string;
  phone: string;
  item_type: string;
  purity: string;
  estimated_weight?: string;
  description?: string;
}): Promise<void> {
  await client.post('/buyback/', data);
}

// ── Custom Orders ─────────────────────────────────────────────────────────────

export async function submitCustomOrder(data: {
  name: string;
  email: string;
  phone: string;
  piece_type: string;
  metal: string;
  budget: string;
  description: string;
  occasion?: string;
}): Promise<void> {
  await client.post('/custom-orders/', data);
}
