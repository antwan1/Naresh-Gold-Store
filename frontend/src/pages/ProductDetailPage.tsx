import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaEnvelope,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaChevronRight,
} from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { getProduct, getProducts } from '../services/api';
import type { Product, ProductImage } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const METAL_LABELS: Record<Product['metal_type'], string> = {
  gold: 'Gold',
  silver: 'Silver',
  diamond: 'Diamond',
  platinum: 'Platinum',
  other: 'Other',
};

function GoldDivider() {
  return <div className="w-full h-px" style={{ backgroundColor: 'rgba(201,168,76,0.4)' }} />;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-2 py-2" style={{ borderBottom: '1px solid #E5E7EB' }}>
      <span
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
      >
        {label}
      </span>
      <span
        className="text-sm"
        style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
      >
        {value}
      </span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    getProduct(slug)
      .then((p) => {
        setProduct(p);
        // Set primary image as selected, or first image
        const primary =
          p.images.find((img) => img.is_primary) ||
          p.images[0] ||
          null;
        setSelectedImage(primary);

        // Fetch related products from same category
        return getProducts({ category: p.category.slug }).then((res) => {
          const related = res.results.filter((rp) => rp.slug !== p.slug).slice(0, 4);
          setRelatedProducts(related);
        });
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/products/' + slug } });
      return;
    }
    if (!product) return;
    setCartError('');
    try {
      await addToCart(product.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {
      setCartError('Failed to add to cart. Please try again.');
    }
  }

  function handleSendEnquiry() {
    navigate(`/contact?product=${slug}`);
  }

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (loading) {
    return (
      <main
        className="min-h-screen pt-16"
        style={{ backgroundColor: '#FAF9F6' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="flex flex-col gap-3">
              <div
                className="w-full rounded-lg animate-pulse"
                style={{ aspectRatio: '1/1', backgroundColor: '#E5E7EB' }}
              />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded animate-pulse"
                    style={{ backgroundColor: '#E5E7EB' }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-8 rounded animate-pulse w-3/4" style={{ backgroundColor: '#E5E7EB' }} />
              <div className="h-6 rounded animate-pulse w-1/4" style={{ backgroundColor: '#E5E7EB' }} />
              <div className="h-px w-full" style={{ backgroundColor: '#E5E7EB' }} />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 rounded animate-pulse" style={{ backgroundColor: '#E5E7EB', width: `${70 - i * 10}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <main
        className="min-h-screen pt-16 flex items-center justify-center"
        style={{ backgroundColor: '#FAF9F6' }}
      >
        <div className="text-center flex flex-col items-center gap-6 px-4">
          <span className="text-5xl opacity-20" style={{ color: '#C9A84C' }}>♦</span>
          <h1
            className="text-2xl font-normal"
            style={{ color: '#2C2C2C', fontFamily: 'var(--font-heading)' }}
          >
            Product not found
          </h1>
          <p style={{ color: '#6B7280', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
            This piece may no longer be available.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-semibold no-underline transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)' }}
          >
            <FaArrowLeft size={12} />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl =
    selectedImage?.image ||
    product.primary_image ||
    null;

  return (
    <main
      className="min-h-screen pt-16"
      style={{ backgroundColor: '#FAF9F6' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 mb-8 text-xs"
          style={{ fontFamily: 'var(--font-body)', color: '#6B7280' }}
        >
          <Link to="/" className="no-underline hover:text-[#C9A84C] transition-colors">Home</Link>
          <FaChevronRight size={8} />
          <Link to="/shop" className="no-underline hover:text-[#C9A84C] transition-colors">Shop</Link>
          <FaChevronRight size={8} />
          <Link
            to={`/shop?category=${product.category.slug}`}
            className="no-underline hover:text-[#C9A84C] transition-colors"
          >
            {product.category.name}
          </Link>
          <FaChevronRight size={8} />
          <span style={{ color: '#2C2C2C' }}>{product.name}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 md:gap-14">

          {/* ── Left: Image Gallery ─────────────────────────────────────── */}
          <div data-testid="product-images" className="flex flex-col gap-4">
            {/* Main image */}
            <div
              className="relative rounded-lg overflow-hidden cursor-zoom-in"
              style={{
                aspectRatio: '1/1',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 20px rgba(26,31,58,0.10)',
                border: '1px solid rgba(201,168,76,0.15)',
              }}
              onClick={() => imageUrl && setLightboxOpen(true)}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={selectedImage?.alt_text || product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #1A1F3A 0%, #2a3160 100%)',
                  }}
                >
                  <span className="text-6xl opacity-20" style={{ color: '#C9A84C' }}>♦</span>
                </div>
              )}

              {/* Gold corner flourishes */}
              <div
                className="absolute top-3 left-3 w-6 h-6 pointer-events-none"
                style={{
                  borderTop: '1px solid rgba(201,168,76,0.4)',
                  borderLeft: '1px solid rgba(201,168,76,0.4)',
                }}
              />
              <div
                className="absolute bottom-3 right-3 w-6 h-6 pointer-events-none"
                style={{
                  borderBottom: '1px solid rgba(201,168,76,0.4)',
                  borderRight: '1px solid rgba(201,168,76,0.4)',
                }}
              />
            </div>

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className="flex-shrink-0 w-16 h-16 rounded overflow-hidden transition-all duration-200"
                    style={{
                      border:
                        selectedImage?.id === img.id
                          ? '2px solid #C9A84C'
                          : '2px solid #E5E7EB',
                      opacity: selectedImage?.id === img.id ? 1 : 0.7,
                    }}
                  >
                    <img
                      src={img.image}
                      alt={img.alt_text || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ──────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Category badge */}
            <div>
              <span
                className="inline-block text-xs px-2.5 py-0.5 rounded-full"
                style={{
                  border: '1px solid #C9A84C',
                  color: '#C9A84C',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {product.category.name}
              </span>
            </div>

            {/* Product name */}
            <h1
              data-testid="product-name"
              className="text-3xl sm:text-4xl font-normal leading-tight"
              style={{ color: '#2C2C2C', fontFamily: 'var(--font-heading)' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div>
              {product.is_price_on_request ? (
                <p
                  data-testid="price-on-request"
                  className="text-xl italic"
                  style={{ color: '#C9A84C', fontFamily: 'var(--font-heading)' }}
                >
                  Price on Request
                </p>
              ) : product.price ? (
                <p
                  data-testid="product-price"
                  className="text-2xl font-bold"
                  style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
                >
                  £{parseFloat(product.price).toLocaleString('en-GB', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              ) : null}
            </div>

            <GoldDivider />

            {/* Specs grid */}
            <div className="flex flex-col">
              <div data-testid="product-metal-type">
                <SpecRow
                  label="Metal Type"
                  value={METAL_LABELS[product.metal_type]}
                />
              </div>
              <div data-testid="product-weight">
                <SpecRow
                  label="Weight"
                  value={product.weight_grams ? `${product.weight_grams}g` : '—'}
                />
              </div>
              <div data-testid="product-purity">
                <SpecRow
                  label="Purity"
                  value={product.purity || '—'}
                />
              </div>
              <SpecRow
                label="SKU"
                value={product.sku}
              />
              <SpecRow
                label="Stock"
                value={
                  product.stock_quantity > 0
                    ? `${product.stock_quantity} available`
                    : 'Out of stock'
                }
              />
            </div>

            {/* Description */}
            <p
              data-testid="product-description"
              className="text-sm leading-relaxed"
              style={{ color: '#6B7280', fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              {product.description}
            </p>

            <GoldDivider />

            {/* Quantity + Cart */}
            {!product.is_price_on_request && product.stock_quantity > 0 && (
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div
                  className="flex items-center rounded overflow-hidden"
                  style={{ border: '1px solid #E5E7EB' }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center transition-colors duration-200 hover:bg-gray-50"
                    style={{ color: '#6B7280' }}
                    aria-label="Decrease quantity"
                  >
                    <FaMinus size={10} />
                  </button>
                  <input
                    data-testid="quantity-input"
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1))
                      )
                    }
                    className="w-12 h-10 text-center text-sm outline-none"
                    style={{
                      color: '#2C2C2C',
                      fontFamily: 'var(--font-body)',
                      borderLeft: '1px solid #E5E7EB',
                      borderRight: '1px solid #E5E7EB',
                    }}
                  />
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock_quantity, q + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center transition-colors duration-200 hover:bg-gray-50"
                    style={{ color: '#6B7280' }}
                    aria-label="Increase quantity"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                {/* Add to cart button */}
                <button
                  data-testid="add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: addedToCart ? '#16A34A' : '#C9A84C',
                    color: '#0F1328',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <FaShoppingCart size={14} />
                  {addedToCart ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            )}
            {cartError && (
              <p className="text-xs mt-1" style={{ color: '#DC2626', fontFamily: 'var(--font-body)' }}>{cartError}</p>
            )}

            {/* Send Enquiry button */}
            <button
              data-testid="send-enquiry-btn"
              onClick={handleSendEnquiry}
              className="w-full flex items-center justify-center gap-2 py-3 rounded text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-[#1A1F3A] hover:text-white"
              style={{
                border: '2px solid #1A1F3A',
                color: '#1A1F3A',
                fontFamily: 'var(--font-body)',
                backgroundColor: 'transparent',
              }}
            >
              <FaEnvelope size={13} />
              Send Enquiry
            </button>

            {/* Wishlist */}
            <button
              data-testid="wishlist-btn"
              onClick={() => setWishlisted((w) => !w)}
              className="flex items-center gap-2 text-sm transition-colors duration-200"
              style={{
                color: wishlisted ? '#C9A84C' : '#6B7280',
                fontFamily: 'var(--font-body)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {wishlisted ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
              {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>

            {/* SKU */}
            <p
              className="text-xs"
              style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
            >
              SKU: {product.sku}
            </p>
          </div>
        </div>

        {/* ── Related Products ─────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section
            data-testid="related-products"
            className="mt-20"
          >
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <h2
                  className="text-2xl sm:text-3xl font-normal"
                  style={{ color: '#2C2C2C', fontFamily: 'var(--font-heading)' }}
                >
                  You May Also Like
                </h2>
                <div
                  className="w-12 h-px mx-auto mt-3"
                  style={{ backgroundColor: '#C9A84C' }}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                {relatedProducts.map((rp, i) => (
                  <div
                    key={rp.id}
                    className={`animate-fade-in-up stagger-${Math.min(i + 1, 4)}`}
                  >
                    <ProductCard product={rp} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(15,19,40,0.92)' }}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt={selectedImage?.alt_text || product.name}
              className="max-w-full max-h-[85vh] object-contain"
            />
            <button
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-200 hover:bg-white hover:text-[#1A1F3A]"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
