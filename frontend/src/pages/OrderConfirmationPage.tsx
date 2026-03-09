import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../services/api';
import type { Order } from '../types';

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<Order['status'], { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706' },
  confirmed: { bg: '#D1FAE5', text: '#065F46' },
  shipped: { bg: '#DBEAFE', text: '#1D4ED8' },
  delivered: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
};

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      setError('Invalid order ID.');
      setIsLoading(false);
      return;
    }
    getOrder(orderId)
      .then(setOrder)
      .catch(() => setError('Could not load your order details.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF9F6' }}>
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }}
        />
      </main>
    );
  }

  return (
    <main
      data-testid="order-confirmation"
      className="min-h-screen pt-28 pb-16 px-4"
      style={{ backgroundColor: '#FAF9F6' }}
    >
      <div className="max-w-lg mx-auto text-center">
        {/* Green checkmark */}
        <div className="mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg"
            style={{ backgroundColor: '#D1FAE5', border: '3px solid #16A34A' }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h1
          className="text-3xl font-semibold mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}
        >
          Order Confirmed!
        </h1>

        {error ? (
          <p className="text-sm mb-8" style={{ color: '#DC2626', fontFamily: 'var(--font-body)' }}>
            {error}
          </p>
        ) : order ? (
          <>
            <p className="text-sm mb-6" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
              Thank you for your order. We've received it and will be in touch shortly.
            </p>

            {/* Gold divider */}
            <div className="w-12 h-0.5 mx-auto mb-8" style={{ backgroundColor: '#C9A84C' }} />

            {/* Order details card */}
            <div
              className="rounded-xl p-6 text-left mb-8"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
            >
              {/* Order # and status */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                    Order Number
                  </p>
                  <p className="text-lg font-bold" style={{ color: '#1A1F3A', fontFamily: 'var(--font-heading)' }}>
                    #{order.id}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: STATUS_COLORS[order.status].bg,
                    color: STATUS_COLORS[order.status].text,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="h-px mb-4" style={{ backgroundColor: '#E5E7EB' }} />

              {/* Shipping address */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                  Shipping Address
                </p>
                <p className="text-sm" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                  {order.shipping_address_line1}
                  {order.shipping_address_line2 && (
                    <>
                      <br />
                      {order.shipping_address_line2}
                    </>
                  )}
                  <br />
                  {order.shipping_city}
                  <br />
                  {order.shipping_postcode}
                </p>
              </div>

              <div className="h-px mb-4" style={{ backgroundColor: '#E5E7EB' }} />

              {/* Items */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                  Items Ordered
                </p>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-1.5" style={{ fontFamily: 'var(--font-body)' }}>
                    <span style={{ color: '#2C2C2C' }}>
                      {item.product_name}{' '}
                      <span style={{ color: '#6B7280' }}>× {item.quantity}</span>
                    </span>
                    <span style={{ color: '#1A1F3A', fontWeight: 600 }}>
                      £{parseFloat(item.total_price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px mb-4" style={{ backgroundColor: '#E5E7EB' }} />

              {/* Total */}
              <div className="flex justify-between text-base font-bold" style={{ fontFamily: 'var(--font-body)', color: '#1A1F3A' }}>
                <span>Total</span>
                <span>£{parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : null}

        <Link
          to="/shop"
          className="inline-block px-8 py-3 rounded font-semibold text-sm tracking-wide no-underline transition-opacity duration-200 hover:opacity-90"
          style={{
            backgroundColor: '#C9A84C',
            color: '#0F1328',
            fontFamily: 'var(--font-body)',
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
