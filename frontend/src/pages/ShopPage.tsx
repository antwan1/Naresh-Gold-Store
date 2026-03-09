import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { getCategories, getProducts } from '../services/api';
import type { Category, Product } from '../types';

const METAL_TYPES = [
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'other', label: 'Other' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Sort: Default' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-created_at', label: 'Newest First' },
  { value: 'name', label: 'Name: A–Z' },
];

const PAGE_SIZE = 12;

function GoldDivider() {
  return <div className="w-full h-px" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col gap-3">
      <button
        className="flex items-center justify-between w-full text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
        >
          {title}
        </span>
        <FaChevronDown
          size={10}
          style={{
            color: '#6B7280',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>
      {open && children}
      <GoldDivider />
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Derived filter state from URL ──────────────────────────────────────
  const selectedCategory = searchParams.get('category') || '';
  const selectedMetal = searchParams.get('metal_type') || '';
  const priceMin = searchParams.get('price_min') || '';
  const priceMax = searchParams.get('price_max') || '';
  const ordering = searchParams.get('ordering') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // ── Local state ────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounced price inputs (so we don't fire API on every keystroke)
  const [localPriceMin, setLocalPriceMin] = useState(priceMin);
  const [localPriceMax, setLocalPriceMax] = useState(priceMax);

  // ── Helpers ────────────────────────────────────────────────────────────
  const updateParam = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        next.delete('page'); // reset to page 1 when filter changes
        return next;
      });
    },
    [setSearchParams]
  );

  const clearFilters = () => {
    setSearchParams({});
    setLocalPriceMin('');
    setLocalPriceMax('');
  };

  const applyPriceFilter = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (localPriceMin) next.set('price_min', localPriceMin);
      else next.delete('price_min');
      if (localPriceMax) next.set('price_max', localPriceMax);
      else next.delete('price_max');
      next.delete('page');
      return next;
    });
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasActiveFilters =
    selectedCategory || selectedMetal || priceMin || priceMax || ordering;

  // ── API calls ──────────────────────────────────────────────────────────
  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Parameters<typeof getProducts>[0] = {
      page: currentPage,
    };
    if (selectedCategory) params.category = selectedCategory;
    if (selectedMetal) params.metal_type = selectedMetal;
    if (priceMin) params.price_min = parseFloat(priceMin);
    if (priceMax) params.price_max = parseFloat(priceMax);
    if (ordering) params.ordering = ordering;

    getProducts(params)
      .then((res) => {
        setProducts(res.results);
        setTotalCount(res.count);
      })
      .catch(() => {
        setProducts([]);
        setTotalCount(0);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedMetal, priceMin, priceMax, ordering, currentPage]);

  // Keep local price inputs in sync when URL changes externally
  useEffect(() => {
    setLocalPriceMin(priceMin);
    setLocalPriceMax(priceMax);
  }, [priceMin, priceMax]);

  // ── Sidebar content (reused in both desktop and drawer) ────────────────
  const sidebarContent = useMemo(
    () => (
      <aside className="flex flex-col gap-5">
        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold underline transition-colors duration-200 hover:text-[#C9A84C] text-left"
            style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
          >
            Clear All Filters
          </button>
        )}

        {/* Category filter */}
        <FilterSection title="Category">
          <div
            data-testid="category-filter"
            className="flex flex-col gap-2"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={!selectedCategory}
                onChange={() => updateParam('category', '')}
                className="accent-[#C9A84C]"
              />
              <span
                className="text-sm"
                style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
              >
                All Categories
              </span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value={cat.slug}
                    checked={selectedCategory === cat.slug}
                    onChange={() => updateParam('category', cat.slug)}
                    className="accent-[#C9A84C]"
                  />
                  <span
                    className="text-sm"
                    style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
                  >
                    {cat.name}
                  </span>
                </span>
                {cat.product_count > 0 && (
                  <span
                    className="text-xs"
                    style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
                  >
                    ({cat.product_count})
                  </span>
                )}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Metal type filter */}
        <FilterSection title="Metal Type">
          <div data-testid="metal-type-filter" className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="metal_type"
                value=""
                checked={!selectedMetal}
                onChange={() => updateParam('metal_type', '')}
                className="accent-[#C9A84C]"
              />
              <span
                className="text-sm"
                style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
              >
                All Metals
              </span>
            </label>
            {METAL_TYPES.map((m) => (
              <label key={m.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="metal_type"
                  value={m.value}
                  checked={selectedMetal === m.value}
                  onChange={() => updateParam('metal_type', m.value)}
                  className="accent-[#C9A84C]"
                />
                <span
                  className="text-sm"
                  style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
                >
                  {m.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price range */}
        <FilterSection title="Price Range">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label
                  className="block text-xs mb-1"
                  style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
                >
                  Min (£)
                </label>
                <input
                  data-testid="price-min"
                  type="number"
                  min="0"
                  value={localPriceMin}
                  onChange={(e) => setLocalPriceMin(e.target.value)}
                  onBlur={applyPriceFilter}
                  onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded text-sm outline-none transition-colors duration-200"
                  style={{
                    border: '1px solid #E5E7EB',
                    fontFamily: 'var(--font-body)',
                    color: '#2C2C2C',
                  }}
                />
              </div>
              <span className="text-sm mt-5" style={{ color: '#6B7280' }}>–</span>
              <div className="flex-1">
                <label
                  className="block text-xs mb-1"
                  style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
                >
                  Max (£)
                </label>
                <input
                  data-testid="price-max"
                  type="number"
                  min="0"
                  value={localPriceMax}
                  onChange={(e) => setLocalPriceMax(e.target.value)}
                  onBlur={applyPriceFilter}
                  onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                  placeholder="Any"
                  className="w-full px-3 py-2 rounded text-sm outline-none transition-colors duration-200"
                  style={{
                    border: '1px solid #E5E7EB',
                    fontFamily: 'var(--font-body)',
                    color: '#2C2C2C',
                  }}
                />
              </div>
            </div>
            <button
              onClick={applyPriceFilter}
              className="w-full py-2 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: '#1A1F3A',
                color: '#C9A84C',
                fontFamily: 'var(--font-body)',
              }}
            >
              Apply Price
            </button>
          </div>
        </FilterSection>
      </aside>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, selectedCategory, selectedMetal, localPriceMin, localPriceMax, hasActiveFilters]
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen pt-16"
      style={{ backgroundColor: '#FAF9F6' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page heading */}
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl font-normal"
            style={{ color: '#2C2C2C', fontFamily: 'var(--font-heading)' }}
          >
            Our Collection
          </h1>
          <div
            className="mt-2 w-12 h-px"
            style={{ backgroundColor: '#C9A84C' }}
          />
        </div>

        {/* Top bar: filter button (mobile) + sort dropdown */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile filter toggle */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold lg:hidden transition-colors duration-200 hover:bg-[#1A1F3A] hover:text-white"
              style={{
                border: '1px solid #1A1F3A',
                color: '#1A1F3A',
                fontFamily: 'var(--font-body)',
              }}
              onClick={() => setDrawerOpen(true)}
            >
              <FaFilter size={12} />
              Filters {hasActiveFilters && '•'}
            </button>

            {/* Product count */}
            {!loading && (
              <p
                className="text-sm"
                style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
              >
                Showing{' '}
                <span style={{ color: '#2C2C2C', fontWeight: 600 }}>
                  {Math.min((currentPage - 1) * PAGE_SIZE + products.length, totalCount)}
                </span>{' '}
                of{' '}
                <span style={{ color: '#2C2C2C', fontWeight: 600 }}>
                  {totalCount}
                </span>{' '}
                products
              </p>
            )}
          </div>

          {/* Sort dropdown */}
          <select
            data-testid="sort-dropdown"
            value={ordering}
            onChange={(e) => updateParam('ordering', e.target.value)}
            className="px-3 py-2 rounded text-sm outline-none transition-colors duration-200 cursor-pointer"
            style={{
              border: '1px solid #E5E7EB',
              color: '#2C2C2C',
              fontFamily: 'var(--font-body)',
              backgroundColor: '#FFFFFF',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Main layout: sidebar + grid */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div
            className="hidden lg:block flex-shrink-0 w-56"
            style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 12px rgba(26,31,58,0.06)', alignSelf: 'flex-start', position: 'sticky', top: '80px' }}
          >
            {sidebarContent}
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div
                data-testid="loading-spinner"
                className="flex flex-col items-center justify-center py-20 gap-4"
              >
                <div
                  className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }}
                />
                <p style={{ color: '#6B7280', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
                  Loading collection...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div
                data-testid="no-results"
                className="flex flex-col items-center justify-center py-20 gap-4 text-center"
              >
                <span className="text-4xl opacity-20" style={{ color: '#C9A84C' }}>♦</span>
                <p
                  className="text-lg"
                  style={{ color: '#2C2C2C', fontFamily: 'var(--font-heading)' }}
                >
                  No pieces found
                </p>
                <p
                  className="text-sm"
                  style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
                >
                  Try adjusting your filters or{' '}
                  <button
                    onClick={clearFilters}
                    className="underline hover:text-[#C9A84C] transition-colors duration-200"
                    style={{ color: '#C9A84C' }}
                  >
                    clear all filters
                  </button>
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                  {products.map((product, i) => (
                    <div
                      key={product.id}
                      className={`animate-fade-in-up stagger-${Math.min(i + 1, 4)}`}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setSearchParams((prev) => {
                            const next = new URLSearchParams(prev);
                            next.set('page', String(pageNum));
                            return next;
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-9 h-9 rounded flex items-center justify-center text-sm font-semibold transition-all duration-200"
                        style={{
                          backgroundColor:
                            currentPage === pageNum ? '#C9A84C' : '#FFFFFF',
                          color: currentPage === pageNum ? '#0F1328' : '#2C2C2C',
                          border: currentPage === pageNum
                            ? '1px solid #C9A84C'
                            : '1px solid #E5E7EB',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(15,19,40,0.5)' }}
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div
            className="fixed left-0 top-0 bottom-0 z-50 overflow-y-auto"
            style={{
              width: 'min(320px, 85vw)',
              backgroundColor: '#FFFFFF',
              padding: '24px 20px',
              boxShadow: '4px 0 24px rgba(26,31,58,0.15)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-base font-semibold"
                style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
              >
                Filters
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-[#6B7280] hover:text-[#2C2C2C] transition-colors"
                aria-label="Close filters"
              >
                <FaTimes size={18} />
              </button>
            </div>
            {sidebarContent}
          </div>
        </>
      )}
    </main>
  );
}
