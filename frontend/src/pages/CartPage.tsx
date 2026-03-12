import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { CartItem } from '../types';

function QuantityControl({
  item,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
                <>
<Helmet>
              <title>Shopping Cart — Naresh Jewellers</title>
              <meta name="description" content="Review your selected jewellery items and proceed to checkout." />
              <meta property="og:title" content="Shopping Cart — Naresh Jewellers" />
              <meta property="og:description" content="Review your selected jewellery items and proceed to checkout." />
              <meta property="og:type" content="website" />
              <meta property="og:site_name" content="Naresh Jewellers" />
            </Helmet>
    <div className="flex items-center gap-1">
      <button
        data-testid="quantity-decrease"
        onClick={onDecrease}
        disabled={item.quantity <= 1}
        className="w-7 h-7 flex items-center justify-center rounded transition-colors duration-150"
        style={{
          border: '1px solid #E5E7EB',
          color: item.quantity <= 1 ? '#D1D5DB' : '#2C2C2C',
          backgroundColor: '#F9FAFB',
          cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
        }}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        data-testid="item-quantity"
        className="w-8 text-center text-sm font-semibold"
        style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
      >
        {item.quantity}
      </span>
      <button
        data-testid="quantity-increase"
        onClick={onIncrease}
        className="w-7 h-7 flex items-center justify-center rounded transition-colors duration-150"
        style={{
          border: '1px solid #E5E7EB',
          color: '#2C2C2C',
          backgroundColor: '#F9FAFB',
          cursor: 'pointer',
        }}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
    </>);
}

function ProductImageCell({ item }: { item: CartItem }) {
  const primaryImage = item.product.images?.find((img) => img.is_primary) ?? item.product.images?.[0];
  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden flex-shrink-0" style={{ border: '1px solid #E5E7EB' }}>
      {primaryImage ? (
        <img
          src={primaryImage.image}
          alt={primaryImage.alt_text || item.product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F5F0E8' }}>
          <span className="text-2xl">💍</span>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Not logged in
  if (!isAuthenticated) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: '#FAF9F6' }}
      >
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🛒</div>
          <h2
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}
          >
            Sign in to view your cart
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
            Your cart is saved to your account.
          </p>
          <Link
            to="/login"
            state={{ from: '/cart' }}
            className="inline-block px-6 py-3 rounded font-semibold text-sm no-underline transition-colors duration-200"
            style={{ backgroundColor: '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)' }}
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="text-center">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }}
          />
          <p style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>Loading your cart…</p>
        </div>
      </main>
    );
  }

  const items = cart?.items ?? [];
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: '#FAF9F6' }}
      >
        <div data-testid="empty-cart" className="text-center max-w-sm">
          {/* Simple SVG shopping bag illustration */}
          <svg
            viewBox="0 0 80 80"
            className="w-24 h-24 mx-auto mb-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="10" y="25" width="60" height="45" rx="4" stroke="#C9A84C" strokeWidth="2.5" fill="#F5F0E8" />
            <path d="M28 25V20a12 12 0 0124 0v5" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="40" y1="40" x2="40" y2="55" stroke="#D4B96B" strokeWidth="2" strokeLinecap="round" />
            <line x1="32" y1="47" x2="48" y2="47" stroke="#D4B96B" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h2
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}
          >
            Your cart is empty
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
            Discover our exquisite jewellery collections.
          </p>
          <Link
            data-testid="continue-shopping"
            to="/shop"
            className="inline-block px-6 py-3 rounded font-semibold text-sm no-underline transition-colors duration-200"
            style={{ backgroundColor: '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)' }}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = cart?.total ?? '0.00';

  async function handleIncrease(item: CartItem) {
    try {
      await updateItem(item.id, item.quantity + 1);
    } catch {
      // silently ignore for now
    }
  }

  async function handleDecrease(item: CartItem) {
    if (item.quantity <= 1) return;
    try {
      await updateItem(item.id, item.quantity - 1);
    } catch {
      // silently ignore
    }
  }

  async function handleRemove(itemId: number) {
    try {
      await removeItem(itemId);
    } catch {
      // silently ignore
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-16 px-4" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="max-w-6xl mx-auto">
        {/* Page title */}
        <div className="mb-8 flex items-center justify-between">
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}
          >
            Shopping Cart
          </h1>
          <Link
            data-testid="continue-shopping"
            to="/shop"
            className="text-sm font-semibold no-underline hover:underline"
            style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}
          >
            ← Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Cart items ── */}
          <div className="flex-1">
            {/* Desktop table header */}
            <div
              className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 pb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#6B7280', fontFamily: 'var(--font-body)', borderBottom: '1px solid #E5E7EB' }}
            >
              <span>Product</span>
              <span className="text-center w-28">Quantity</span>
              <span className="text-right w-24">Price</span>
              <span className="w-6" />
            </div>

            <ul className="divide-y" style={{ borderColor: '#E5E7EB' }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  data-testid="cart-item"
                  className="py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Image + info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <ProductImageCell item={item} />
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="block font-semibold text-sm no-underline hover:text-[#C9A84C] transition-colors truncate"
                        style={{ color: '#1A1F3A', fontFamily: 'var(--font-heading)' }}
                      >
                        {item.product.name}
                      </Link>
                      {item.product.purity && (
                        <span
                          className="text-xs mt-0.5 inline-block px-2 py-0.5 rounded-full"
                          style={{
                            border: '1px solid #C9A84C',
                            color: '#C9A84C',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {item.product.purity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-6 sm:gap-4 justify-between sm:justify-end">
                    <QuantityControl
                      item={item}
                      onIncrease={() => handleIncrease(item)}
                      onDecrease={() => handleDecrease(item)}
                    />

                    {/* Line total */}
                    <span
                      className="w-24 text-right text-sm font-semibold"
                      style={{ color: '#1A1F3A', fontFamily: 'var(--font-body)' }}
                    >
                      {item.line_total
                        ? `£${parseFloat(item.line_total).toFixed(2)}`
                        : item.product.is_price_on_request
                        ? 'POA'
                        : item.product.price
                        ? `£${(parseFloat(item.product.price) * item.quantity).toFixed(2)}`
                        : '—'}
                    </span>

                    {/* Remove */}
                    <button
                      data-testid="remove-item"
                      onClick={() => handleRemove(item.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-full text-sm transition-colors duration-150"
                      style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
                      aria-label={`Remove ${item.product.name}`}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Order Summary sidebar ── */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div
              className="rounded-xl p-6 sticky top-24"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}
              >
                Order Summary
              </h2>
              <div className="h-px mb-4" style={{ backgroundColor: '#E5E7EB' }} />

              <div className="flex justify-between text-sm mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                <span style={{ color: '#6B7280' }}>
                  Subtotal ({cart?.item_count} {cart?.item_count === 1 ? 'item' : 'items'})
                </span>
                <span data-testid="cart-subtotal" style={{ color: '#2C2C2C', fontWeight: 600 }}>
                  £{parseFloat(subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                <span style={{ color: '#6B7280' }}>Shipping</span>
                <span style={{ color: '#16A34A', fontWeight: 600 }}>Calculated at checkout</span>
              </div>

              <div className="h-px mb-4" style={{ backgroundColor: '#E5E7EB' }} />

              <div
                className="flex justify-between text-base font-bold mb-6"
                style={{ fontFamily: 'var(--font-body)', color: '#1A1F3A' }}
              >
                <span>Total</span>
                <span data-testid="cart-total">£{parseFloat(subtotal).toFixed(2)}</span>
              </div>

              <button
                data-testid="checkout-btn"
                onClick={() => navigate('/checkout')}
                className="w-full py-3 rounded font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: '#C9A84C',
                  color: '#0F1328',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Proceed to Checkout
              </button>

              <p className="text-center text-xs mt-3" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                Secure checkout — 256-bit SSL
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
