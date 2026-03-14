import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { checkWishlisted, toggleWishlist } from '../services/api';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const METAL_LABELS: Record<Product['metal_type'], string> = {
  gold: 'Gold',
  silver: 'Silver',
  diamond: 'Diamond',
  platinum: 'Platinum',
  other: 'Other',
};

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    checkWishlisted(product.id)
      .then((r) => setWishlisted(r.wishlisted))
      .catch(() => {});
  }, [isAuthenticated, product.id]);
  const [imageHovered, setImageHovered] = useState(false);

  const imageUrl = product.primary_image
    || (product.images.find((img) => img.is_primary)?.image)
    || (product.images[0]?.image)
    || null;

  return (
    <div
      data-testid="product-card"
      className="group relative flex flex-col rounded-lg overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: imageHovered
          ? '0 8px 30px rgba(26,31,58,0.12)'
          : '0 2px 12px rgba(26,31,58,0.08)',
        border: imageHovered ? '1px solid #C9A84C' : '1px solid transparent',
      }}
      onMouseEnter={() => setImageHovered(true)}
      onMouseLeave={() => setImageHovered(false)}
    >
      {/* Image container — 65% of card height via aspect ratio */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block overflow-hidden"
        style={{ aspectRatio: '3 / 4' }}
        tabIndex={-1}
        aria-hidden="true"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: imageHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          /* Placeholder gradient when no image */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #1A1F3A 0%, #2a3160 50%, #C9A84C22 100%)',
            }}
          >
            <span
              className="text-4xl opacity-30"
              style={{ color: '#C9A84C' }}
            >
              ♦
            </span>
          </div>
        )}

        {/* Wishlist heart */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10"
          style={{
            backgroundColor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isAuthenticated) return;
            setWishlisted((prev) => !prev);
            toggleWishlist(product.id).catch(() => setWishlisted((prev) => !prev));
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? (
            <FaHeart size={14} style={{ color: '#C9A84C' }} />
          ) : (
            <FaRegHeart size={14} style={{ color: '#6B7280' }} />
          )}
        </button>

        {/* Out of stock overlay */}
        {product.stock_quantity === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          >
            <span
              className="px-4 py-2 rounded text-xs font-semibold tracking-widest uppercase"
              style={{
                backgroundColor: 'rgba(220,38,38,0.9)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-body)',
              }}
            >
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick view overlay */}
        {product.stock_quantity > 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: 'rgba(26,31,58,0.45)' }}
        >
          <span
            className="px-4 py-2 rounded text-xs font-semibold tracking-widest uppercase"
            style={{
              backgroundColor: 'rgba(201,168,76,0.9)',
              color: '#0F1328',
              fontFamily: 'var(--font-body)',
            }}
          >
            Quick View
          </span>
        </div>
        )}
      </Link>

      {/* Card info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Metal type badge */}
        <div>
          <span
            className="inline-block text-xs px-2.5 py-0.5 rounded-full"
            style={{
              border: '1px solid #C9A84C',
              color: '#C9A84C',
              fontFamily: 'var(--font-body)',
            }}
          >
            {METAL_LABELS[product.metal_type]}
          </span>
        </div>

        {/* Product name */}
        <h3
          data-testid="product-card-name"
          className="text-base font-medium leading-snug truncate"
          style={{
            color: '#2C2C2C',
            fontFamily: 'var(--font-heading)',
          }}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-auto">
          {product.is_price_on_request ? (
            <p
              className="text-sm italic"
              style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}
            >
              Price on Request
            </p>
          ) : product.price ? (
            <p
              className="text-base font-bold"
              style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
            >
              £{parseFloat(product.price).toLocaleString('en-GB', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          ) : null}
        </div>

        {/* View Details link */}
        <Link
          to={`/products/${product.slug}`}
          className="mt-2 text-xs font-semibold tracking-wide uppercase no-underline transition-colors duration-200 hover:text-[#D4B96B]"
          style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}
