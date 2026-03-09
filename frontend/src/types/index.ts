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
