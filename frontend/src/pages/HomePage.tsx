import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaDirections } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { getCategories, getProducts } from '../services/api';
import type { Category, Product } from '../types';

/* ─── Testimonial data ─────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    text: 'The gold set I bought for my wedding was absolutely breathtaking. Every guest asked where it was from. The craftsmanship is truly unmatched.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Raj Patel',
    text: 'Naresh Jewellers helped me find the perfect diamond ring for my engagement. They were patient, knowledgeable, and the quality exceeded all expectations.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Anita Kumar',
    text: 'I have been a loyal customer for over a decade. The South-East Asian collection is second to none. Pure artistry in every piece.',
    rating: 5,
  },
];

/* ─── Gold Divider ─────────────────────────────────────────────────────── */
function GoldDivider({ className = '' }: { className?: string }) {
  return (
                <>
<Helmet>
              <title>Naresh Jewellers — Handcrafted Gold & Diamond Jewellery</title>
              <meta name="description" content="Exquisite handcrafted gold, silver and diamond jewellery from Naresh Jewellers, Birmingham. Shop our collection or book a private viewing." />
              <meta property="og:title" content="Naresh Jewellers — Handcrafted Gold & Diamond Jewellery" />
              <meta property="og:description" content="Exquisite handcrafted gold, silver and diamond jewellery from Naresh Jewellers, Birmingham. Shop our collection or book a private viewing." />
              <meta property="og:type" content="website" />
              <meta property="og:site_name" content="Naresh Jewellers" />
            </Helmet>
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="w-12 h-px" style={{ backgroundColor: '#C9A84C', opacity: 0.5 }} />
      <span style={{ color: '#C9A84C', fontSize: '10px', opacity: 0.7 }}>♦</span>
      <div className="w-12 h-px" style={{ backgroundColor: '#C9A84C', opacity: 0.5 }} />
    </div>
    </>);
}

/* ─── Section Heading ──────────────────────────────────────────────────── */
function SectionHeading({
  title,
  subtitle,
  light = false,
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <GoldDivider />
      <h2
        className="text-3xl sm:text-4xl font-normal mt-2"
        style={{
          fontFamily: 'var(--font-heading)',
          color: light ? '#FFFFFF' : '#2C2C2C',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-sm sm:text-base max-w-xl"
          style={{
            fontFamily: 'var(--font-body)',
            color: light ? 'rgba(255,255,255,0.65)' : '#6B7280',
            fontWeight: 300,
          }}
        >
          {subtitle}
        </p>
      )}
      <GoldDivider />
    </div>
  );
}

/* ─── Home Page ─────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));

    getProducts({ ordering: '-created_at' })
      .then((res) => {
        // Use featured products if available, otherwise take first 8
        const featured = res.results.filter((p) => p.is_featured);
        setFeaturedProducts(featured.length > 0 ? featured.slice(0, 8) : res.results.slice(0, 8));
      })
      .catch(() => setFeaturedProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <main className="overflow-x-hidden">
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. Categories Showcase ───────────────────────────────────────── */}
      <section
        data-testid="category-showcase"
        className="py-20 px-4"
        style={{ backgroundColor: '#FAF9F6' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <SectionHeading
            title="Shop by Category"
            subtitle="Discover our curated collections — from timeless gold to radiant diamonds."
          />

          {loadingCategories ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg animate-pulse"
                  style={{ aspectRatio: '1/1', backgroundColor: '#E5E7EB' }}
                />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.slice(0, 4).map((cat, i) => (
                <div
                  key={cat.id}
                  className={`animate-fade-in-up stagger-${Math.min(i + 1, 4)}`}
                >
                  <CategoryCard category={cat} />
                </div>
              ))}
            </div>
          ) : (
            /* Placeholder cards when API has no data yet */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {['Gold', 'Silver', 'Diamond', 'South-East Asian'].map((name, i) => (
                <div
                  key={name}
                  className={`relative overflow-hidden rounded-lg animate-fade-in-up stagger-${i + 1}`}
                  style={{ aspectRatio: '1/1' }}
                >
                  <div
                    className="w-full h-full flex items-end p-5"
                    style={{
                      background:
                        'linear-gradient(135deg, #1A1F3A 0%, #2a3160 100%)',
                    }}
                  >
                    <div>
                      <span
                        className="text-xs tracking-widest uppercase opacity-60"
                        style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}
                      >
                        Collection
                      </span>
                      <h3
                        className="text-xl font-medium text-white mt-1"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. Featured Products ─────────────────────────────────────────── */}
      <section
        data-testid="featured-products"
        className="py-20 px-4"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <SectionHeading
            title="Featured Pieces"
            subtitle="Handpicked selections from our finest collections."
          />

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden animate-pulse"
                  style={{ boxShadow: '0 2px 12px rgba(26,31,58,0.08)' }}
                >
                  <div
                    className="w-full"
                    style={{ aspectRatio: '3/4', backgroundColor: '#E5E7EB' }}
                  />
                  <div className="p-4 space-y-3">
                    <div className="h-3 rounded" style={{ backgroundColor: '#E5E7EB', width: '60%' }} />
                    <div className="h-4 rounded" style={{ backgroundColor: '#E5E7EB', width: '85%' }} />
                    <div className="h-3 rounded" style={{ backgroundColor: '#E5E7EB', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product, i) => (
                <div
                  key={product.id}
                  className={`animate-fade-in-up stagger-${Math.min(i + 1, 4)}`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                Our collection is being prepared. Please check back soon.
              </p>
            </div>
          )}

          {/* View All button */}
          {featuredProducts.length > 0 && (
            <div className="flex justify-center">
              <Link
                to="/shop"
                className="inline-block px-8 py-3 rounded text-sm font-semibold tracking-wide uppercase no-underline transition-all duration-200 hover:bg-[#1A1F3A] hover:text-white"
                style={{
                  border: '2px solid #1A1F3A',
                  color: '#1A1F3A',
                  fontFamily: 'var(--font-body)',
                }}
              >
                View All Pieces
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. Store Story ───────────────────────────────────────────────── */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: '#1A1F3A' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left — image placeholder */}
            <div className="relative">
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  aspectRatio: '4/3',
                  background: 'linear-gradient(135deg, #0F1328 0%, #2a3160 100%)',
                  border: '1px solid rgba(201,168,76,0.2)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl opacity-10" style={{ color: '#C9A84C' }}>♦</span>
                </div>
                {/* Gold corner flourishes */}
                <div
                  className="absolute top-4 left-4 w-8 h-8"
                  style={{
                    borderTop: '2px solid rgba(201,168,76,0.4)',
                    borderLeft: '2px solid rgba(201,168,76,0.4)',
                  }}
                />
                <div
                  className="absolute bottom-4 right-4 w-8 h-8"
                  style={{
                    borderBottom: '2px solid rgba(201,168,76,0.4)',
                    borderRight: '2px solid rgba(201,168,76,0.4)',
                  }}
                />
              </div>
            </div>

            {/* Right — text */}
            <div className="flex flex-col gap-6">
              <GoldDivider />
              <h2
                className="text-3xl sm:text-4xl font-normal"
                style={{ color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}
              >
                Our Heritage
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                }}
              >
                For over four decades, Naresh Jewellers has been synonymous with uncompromising quality and timeless elegance. What began as a small family workshop has grown into one of the most trusted jewellery destinations in the region.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                }}
              >
                Every piece in our collection carries the soul of South-East Asian artistry — intricate filigree, hand-set stones, and the kind of craftsmanship that can only come from generations of dedicated practice.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold no-underline transition-colors duration-200 hover:text-[#E8D5A3]"
                style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}
              >
                Learn Our Story &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials ──────────────────────────────────────────────── */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: '#F5F0E8' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <SectionHeading
            title="What Our Customers Say"
            subtitle="Trusted by thousands of families for their most cherished moments."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.id}
                className={`rounded-lg p-6 sm:p-8 flex flex-col gap-4 animate-fade-in-up stagger-${i + 1}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 12px rgba(26,31,58,0.08)',
                  border: '1px solid rgba(201,168,76,0.12)',
                }}
              >
                {/* Decorative quote mark */}
                <span
                  className="text-4xl leading-none"
                  style={{ color: '#C9A84C', opacity: 0.3, fontFamily: 'var(--font-heading)' }}
                >
                  &ldquo;
                </span>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <FaStar
                      key={si}
                      size={12}
                      style={{ color: si < t.rating ? '#C9A84C' : '#E5E7EB' }}
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p
                  className="text-sm italic leading-relaxed flex-1"
                  style={{ color: '#6B7280', fontFamily: 'var(--font-heading)', fontSize: '1rem' }}
                >
                  {t.text}
                </p>

                {/* Customer */}
                <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid #E5E7EB' }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#1A1F3A', color: '#C9A84C', fontFamily: 'var(--font-body)' }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}
                    >
                      Verified Buyer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Store Visit CTA ───────────────────────────────────────────── */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F1328 0%, #1A1F3A 100%)',
        }}
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse at 60% 50%, rgba(201,168,76,0.07) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
          <SectionHeading
            title="Visit Our Store"
            subtitle="Come and experience our collections in person. Our experts are here to help you find the perfect piece."
            light
          />

          {/* Info cards */}
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
            <div
              className="flex items-start gap-3 p-5 rounded-lg flex-1"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.15)',
              }}
            >
              <FaMapMarkerAlt style={{ color: '#C9A84C', marginTop: 2 }} />
              <div>
                <p
                  className="text-xs tracking-widest uppercase mb-1"
                  style={{ color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-body)' }}
                >
                  Address
                </p>
                <p
                  className="text-sm leading-relaxed text-left"
                  style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}
                >
                  123 Jewellers Row<br />Birmingham, B18 6NF
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-3 p-5 rounded-lg flex-1"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.15)',
              }}
            >
              <FaClock style={{ color: '#C9A84C', marginTop: 2 }} />
              <div>
                <p
                  className="text-xs tracking-widest uppercase mb-1"
                  style={{ color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-body)' }}
                >
                  Opening Hours
                </p>
                <p
                  className="text-sm leading-relaxed text-left"
                  style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}
                >
                  Mon–Sat: 10:00 – 18:00<br />Sunday: 11:00 – 16:00
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded text-sm font-semibold tracking-wide uppercase no-underline transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: '#C9A84C',
                color: '#0F1328',
                fontFamily: 'var(--font-body)',
              }}
            >
              <FaCalendarAlt size={14} />
              Book an Appointment
            </Link>
            <a
              href="https://maps.google.com/?q=Jewellers+Row+Birmingham"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded text-sm font-semibold tracking-wide uppercase no-underline transition-all duration-200 hover:bg-white hover:text-[#1A1F3A]"
              style={{
                border: '2px solid rgba(255,255,255,0.4)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-body)',
              }}
            >
              <FaDirections size={14} />
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
