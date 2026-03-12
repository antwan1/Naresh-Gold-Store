export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  product_count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: Category;
  metal_type: 'gold' | 'silver' | 'diamond' | 'platinum' | 'other';
  weight_grams: string;
  purity: string;
  price: string | null;
  is_price_on_request: boolean;
  sku: string;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  images: ProductImage[];
  primary_image: string | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  line_total: string | null;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: string;
  item_count: number;
}

export interface OrderItem {
  id: number;
  product_name: string;
  product_slug: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Order {
  id: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: string;
  payment_method: string;
  shipping_address_line1: string;
  shipping_address_line2: string;
  shipping_city: string;
  shipping_postcode: string;
  notes: string;
  items: OrderItem[];
  created_at: string;
}

export interface AuthUser {
  email: string;
  first_name: string;
  last_name: string;
}

export interface CustomerProfile extends AuthUser {
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postcode?: string;
}

export interface Review {
  id: number;
  product: number;
  customer: number;
  customer_name: string;
  rating: number;
  title: string;
  text: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  admin_reply: string;
  created_at: string;
}

export interface WishlistItem {
  id: number;
  product: Product;
  created_at: string;
}

export interface GoldPrices {
  gold_per_gram: { '24k': number; '22k': number; '18k': number };
  silver_per_gram: number;
  currency: string;
  source: string;
}
