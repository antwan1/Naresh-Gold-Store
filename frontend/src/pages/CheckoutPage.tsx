import { useEffect, useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';
import type { CartItem } from '../types';

const COUNTRIES = [
  'United Kingdom', 'United States', 'Canada', 'Australia', 'New Zealand',
  'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal',
  'Germany', 'France', 'Netherlands', 'Belgium', 'Spain', 'Italy',
  'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Austria',
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain',
  'Singapore', 'Malaysia', 'South Africa', 'Kenya', 'Nigeria',
  'Ireland', 'Portugal', 'Poland', 'Czech Republic', 'Hungary',
];

function OrderSummaryItem({ item }: { item: CartItem }) {
  const primaryImage = item.product.images?.find((img) => img.is_primary) ?? item.product.images?.[0];
  const lineTotal = item.line_total
    ? `£${parseFloat(item.line_total).toFixed(2)}`
    : item.product.is_price_on_request
    ? 'POA'
    : item.product.price
    ? `£${(parseFloat(item.product.price) * item.quantity).toFixed(2)}`
    : '—';

  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid #E5E7EB' }}>
      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0" style={{ border: '1px solid #E5E7EB' }}>
        {primaryImage ? (
          <img src={primaryImage.image} alt={primaryImage.alt_text || item.product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F5F0E8' }}>
            <span>♦</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: '#1A1F3A', fontFamily: 'var(--font-heading)' }}>
          {item.product.name}
        </p>
        <p className="text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
          Qty: {item.quantity}
        </p>
      </div>
      <span className="text-sm font-semibold" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
        {lineTotal}
      </span>
    </div>
  );
}

function InputField({
  label,
  id,
  value,
  onChange,
  required = false,
  placeholder = '',
  type = 'text',
  'data-testid': testId,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  'data-testid'?: string;
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-semibold mb-1.5"
        style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
      >
        {label}
        {required && <span className="ml-0.5" style={{ color: '#DC2626' }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        data-testid={testId}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200"
        style={{
          border: '1px solid #E5E7EB',
          fontFamily: 'var(--font-body)',
          color: '#2C2C2C',
          backgroundColor: '#FFFFFF',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#C9A84C';
          e.target.style.boxShadow = '0 0 0 1px #C9A84C';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#E5E7EB';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

type PaymentMethod = 'cash' | 'paypal' | 'stripe';

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string; badge?: string }[] = [
  {
    value: 'cash',
    label: 'Cash on Collection',
    description: "Pay when you collect from our store. We'll contact you to arrange a convenient time.",
  },
  {
    value: 'paypal',
    label: 'PayPal',
    description: "We'll send you a secure PayPal payment link after your order is confirmed.",
    badge: 'Online',
  },
  {
    value: 'stripe',
    label: 'Card Payment (Stripe)',
    description: "We'll send you a secure payment link after your order is confirmed.",
    badge: 'Online',
  },
];

export default function CheckoutPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  // Contact details (cash on collection)
  const [phone, setPhone] = useState('');

  // Shipping address (online payment)
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('United Kingdom');

  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (authLoading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }

  const items = cart?.items ?? [];
  const total = cart?.total ?? '0.00';
  const isCash = paymentMethod === 'cash';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!isCash && (!addressLine1.trim() || !city.trim() || !country.trim())) {
      setError('Please fill in all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = isCash
        ? {
            payment_method: paymentMethod,
            contact_phone: phone || undefined,
            notes: notes || undefined,
          }
        : {
            payment_method: paymentMethod,
            contact_phone: phone || undefined,
            shipping_address_line1: addressLine1,
            shipping_address_line2: addressLine2 || undefined,
            shipping_city: city,
            shipping_postcode: postcode || undefined,
            shipping_country: country,
            notes: notes || undefined,
          };

      const order = await placeOrder(payload);
      clearCart();
      navigate(`/order-confirmation/${order.id}`, { replace: true });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string | string[]> } })?.response?.data;
      if (data) {
        const first = Object.values(data)[0];
        setError(Array.isArray(first) ? first[0] : String(first));
      } else {
        setError('Failed to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const userEmail = (user as { email?: string } | null)?.email ?? '';

  return (
    <main className="min-h-screen pt-32 pb-16 px-4" style={{ backgroundColor: '#FAF9F6' }}>
      <Helmet>
        <title>Checkout — Naresh Jewellers</title>
        <meta name="description" content="Complete your jewellery purchase securely." />
        <meta property="og:title" content="Checkout — Naresh Jewellers" />
        <meta property="og:description" content="Complete your jewellery purchase securely." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Naresh Jewellers" />
      </Helmet>
      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ── Left: form ── */}
            <div className="flex-1">
              {error && (
                <div
                  className="mb-5 px-4 py-3 rounded text-sm"
                  style={{
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    fontFamily: 'var(--font-body)',
                    border: '1px solid #FECACA',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Payment Method */}
              <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                  Payment Method
                </h2>
                <div className="w-10 h-0.5 mb-5" style={{ backgroundColor: '#C9A84C' }} />
                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map((opt) => {
                    const selected = paymentMethod === opt.value;
                    return (
                      <label
                        key={opt.value}
                        data-testid={`payment-${opt.value}`}
                        className="flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all duration-150"
                        style={{
                          border: selected ? '2px solid #C9A84C' : '2px solid #E5E7EB',
                          backgroundColor: selected ? '#FFFBF0' : '#FFFFFF',
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.value}
                          checked={selected}
                          onChange={() => setPaymentMethod(opt.value)}
                          className="mt-0.5 accent-[#C9A84C]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold" style={{ color: '#1A1F3A', fontFamily: 'var(--font-body)' }}>
                              {opt.label}
                            </p>
                            {opt.badge && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C', fontFamily: 'var(--font-body)' }}
                              >
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                            {opt.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Cash on Collection: contact details */}
              {isCash ? (
                <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                  <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                    Your Contact Details
                  </h2>
                  <div className="w-10 h-0.5 mb-5" style={{ backgroundColor: '#C9A84C' }} />

                  {userEmail && (
                    <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', fontFamily: 'var(--font-body)', color: '#6B7280' }}>
                      Confirmation will be sent to <strong style={{ color: '#1A1F3A' }}>{userEmail}</strong>
                    </div>
                  )}

                  <InputField
                    label="Phone Number"
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    placeholder="+44 7700 900000"
                    data-testid="checkout-phone"
                  />
                  <p className="text-xs mt-1" style={{ color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>
                    We'll call or text to arrange your collection time.
                  </p>
                </div>
              ) : (
                /* Online payment: shipping address */
                <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                  <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                    Shipping Address
                  </h2>
                  <div className="w-10 h-0.5 mb-5" style={{ backgroundColor: '#C9A84C' }} />

                  {/* Country */}
                  <div className="mb-4">
                    <label
                      htmlFor="country"
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
                    >
                      Country <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <select
                      id="country"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{
                        border: '1px solid #E5E7EB',
                        fontFamily: 'var(--font-body)',
                        color: '#2C2C2C',
                        backgroundColor: '#FFFFFF',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#C9A84C';
                        e.target.style.boxShadow = '0 0 0 1px #C9A84C';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <InputField label="Address Line 1" id="address-line1" required value={addressLine1} onChange={setAddressLine1} placeholder="123 High Street" data-testid="checkout-address-line1" />
                  <InputField label="Address Line 2" id="address-line2" value={addressLine2} onChange={setAddressLine2} placeholder="Apartment, suite, unit (optional)" data-testid="checkout-address-line2" />

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <InputField label="City / Town" id="city" required value={city} onChange={setCity} placeholder="London" data-testid="checkout-city" />
                    </div>
                    <div className="w-40">
                      <InputField label="Postcode / ZIP" id="postcode" value={postcode} onChange={setPostcode} placeholder="SW1A 1AA" data-testid="checkout-postcode" />
                    </div>
                  </div>

                  <InputField
                    label="Phone Number"
                    id="shipping-phone"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    placeholder="+44 7700 900000"
                    data-testid="checkout-phone"
                  />
                </div>
              )}

              {/* Notes */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                  Order Notes
                </h2>
                <div className="w-10 h-0.5 mb-5" style={{ backgroundColor: '#C9A84C' }} />
                <label htmlFor="checkout-notes" className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                  Special requests{' '}
                  <span className="font-normal" style={{ color: '#6B7280' }}>(optional)</span>
                </label>
                <textarea
                  id="checkout-notes"
                  data-testid="checkout-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or notes for your order…"
                  className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200 resize-none"
                  style={{ border: '1px solid #E5E7EB', fontFamily: 'var(--font-body)', color: '#2C2C2C', backgroundColor: '#FFFFFF' }}
                  onFocus={(e) => { e.target.style.borderColor = '#C9A84C'; e.target.style.boxShadow = '0 0 0 1px #C9A84C'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* ── Right: order summary ── */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div
                data-testid="order-summary"
                className="rounded-xl p-6 sticky top-24"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
              >
                <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                  Your Order
                </h2>
                <div className="w-10 h-0.5 mb-4" style={{ backgroundColor: '#C9A84C' }} />

                {items.length === 0 ? (
                  <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                    Your cart is empty.
                  </p>
                ) : (
                  <>
                    <div className="mb-4">
                      {items.map((item) => (
                        <OrderSummaryItem key={item.id} item={item} />
                      ))}
                    </div>
                    <div className="flex justify-between text-sm mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                      <span style={{ color: '#6B7280' }}>Subtotal</span>
                      <span style={{ color: '#2C2C2C', fontWeight: 600 }}>£{parseFloat(total).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                      <span style={{ color: '#6B7280' }}>Shipping</span>
                      <span style={{ color: '#16A34A', fontWeight: 600 }}>Free</span>
                    </div>
                    <div className="h-px mb-4" style={{ backgroundColor: '#E5E7EB' }} />
                    <div className="flex justify-between text-base font-bold mb-6" style={{ fontFamily: 'var(--font-body)', color: '#1A1F3A' }}>
                      <span>Total</span>
                      <span>£{parseFloat(total).toFixed(2)}</span>
                    </div>
                  </>
                )}

                <button
                  data-testid="place-order-btn"
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full py-3.5 rounded font-semibold text-sm tracking-wide transition-all duration-200"
                  style={{
                    backgroundColor: isSubmitting || items.length === 0 ? '#D4B96B' : '#C9A84C',
                    color: '#0F1328',
                    fontFamily: 'var(--font-body)',
                    cursor: isSubmitting || items.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Placing Order…' : 'Place Order'}
                </button>

                <p className="text-center text-xs mt-3" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                  By placing your order you agree to our{' '}
                  <span className="underline cursor-pointer" style={{ color: '#C9A84C' }}>
                    Terms &amp; Conditions
                  </span>
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}
