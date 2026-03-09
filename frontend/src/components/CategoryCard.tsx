import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  gold: 'linear-gradient(135deg, #1A1F3A 0%, #2a2200 60%, #C9A84C33 100%)',
  silver: 'linear-gradient(135deg, #1A1F3A 0%, #1a2030 60%, #a8b4c880 100%)',
  diamond: 'linear-gradient(135deg, #0F1328 0%, #1a1f3a 60%, #b8d4f020 100%)',
  platinum: 'linear-gradient(135deg, #1A1F3A 0%, #2a2a2a 60%, #E5E7EB30 100%)',
};

function getGradient(slug: string): string {
  return (
    CATEGORY_GRADIENTS[slug.toLowerCase()] ||
    'linear-gradient(135deg, #1A1F3A 0%, #2a3160 100%)'
  );
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="relative block overflow-hidden rounded-lg no-underline"
      style={{
        aspectRatio: '1 / 1',
        boxShadow: hovered
          ? '0 8px 30px rgba(26,31,58,0.18), 0 0 20px rgba(201,168,76,0.18)'
          : '0 2px 12px rgba(26,31,58,0.10)',
        border: hovered ? '1px solid #C9A84C' : '1px solid transparent',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image or gradient */}
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: getGradient(category.slug) }}
        >
          {/* Decorative symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-6xl sm:text-7xl opacity-20"
              style={{ color: '#C9A84C' }}
            >
              ♦
            </span>
          </div>
        </div>
      )}

      {/* Dark gradient overlay at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: hovered
            ? 'linear-gradient(to top, rgba(15,19,40,0.85) 0%, rgba(15,19,40,0.2) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(15,19,40,0.75) 0%, rgba(15,19,40,0.1) 60%, transparent 100%)',
          transition: 'background 0.3s ease',
        }}
      />

      {/* Category name */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {category.product_count > 0 && (
          <p
            className="text-xs mb-1 tracking-widest uppercase"
            style={{
              color: 'rgba(201,168,76,0.7)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {category.product_count} {category.product_count === 1 ? 'piece' : 'pieces'}
          </p>
        )}
        <h3
          className="text-xl font-medium tracking-wide"
          style={{
            color: '#FFFFFF',
            fontFamily: 'var(--font-heading)',
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
          }}
        >
          {category.name}
        </h3>
        {/* Gold underline on hover */}
        <div
          className="mt-2 h-px transition-all duration-300"
          style={{
            backgroundColor: '#C9A84C',
            width: hovered ? '40px' : '20px',
            opacity: hovered ? 1 : 0.5,
          }}
        />
      </div>
    </Link>
  );
}
