import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders, getProfile, updateProfile, getWishlist, removeWishlistItem } from '../services/api';
import type { CustomerProfile, Order, WishlistItem } from '../types';

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

type Tab = 'orders' | 'profile' | 'wishlist';

function OrdersSection({ orders, isLoading }: { orders: Order[]; isLoading: boolean }) {
  if (isLoading) {
    return (
                  <>
<Helmet>
              <title>My Account — Naresh Jewellers</title>
              <meta name="description" content="Manage your orders, wishlist and profile." />
              <meta property="og:title" content="My Account — Naresh Jewellers" />
              <meta property="og:description" content="Manage your orders, wishlist and profile." />
              <meta property="og:type" content="website" />
              <meta property="og:site_name" content="Naresh Jewellers" />
            </Helmet>
      <div className="flex items-center justify-center py-16">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }}
        />
      </div>
    </>);
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">📦</div>
        <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
          You haven't placed any orders yet.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-4 px-5 py-2 rounded text-sm font-semibold no-underline"
          style={{ backgroundColor: '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)' }}
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="order-history">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ fontFamily: 'var(--font-body)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              {['Order #', 'Date', 'Status', 'Total', ''].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#6B7280' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                data-testid="order-row"
                className="transition-colors"
                style={{ borderBottom: '1px solid #F3F4F6' }}
              >
                <td className="py-4 px-2 font-semibold" style={{ color: '#1A1F3A' }}>
                  #{order.id}
                </td>
                <td className="py-4 px-2" style={{ color: '#6B7280' }}>
                  {new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="py-4 px-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: STATUS_COLORS[order.status].bg,
                      color: STATUS_COLORS[order.status].text,
                    }}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="py-4 px-2 font-semibold" style={{ color: '#1A1F3A' }}>
                  £{parseFloat(order.total_amount).toFixed(2)}
                </td>
                <td className="py-4 px-2">
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="text-xs font-semibold no-underline hover:underline"
                    style={{ color: '#C9A84C' }}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfileSection() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const updated = await updateProfile(profile);
      setProfile(updated);
      setSuccessMsg('Profile updated successfully.');
    } catch {
      setErrorMsg('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function inputStyle(): React.CSSProperties {
    return {
      border: '1px solid #E5E7EB',
      fontFamily: 'var(--font-body)',
      color: '#2C2C2C',
      backgroundColor: '#FFFFFF',
    };
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  const initial = profile ?? { email: user?.email ?? '', first_name: user?.first_name ?? '', last_name: user?.last_name ?? '' };

  return (
    <div data-testid="profile-section">
      <form onSubmit={handleSave} className="max-w-lg">
        {successMsg && (
          <div className="mb-4 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontFamily: 'var(--font-body)', border: '1px solid #A7F3D0' }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: 'var(--font-body)', border: '1px solid #FECACA' }}>
            {errorMsg}
          </div>
        )}

        <div className="flex gap-3 mb-4">
          {(['first_name', 'last_name'] as const).map((field) => (
            <div key={field} className="flex-1">
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                {field === 'first_name' ? 'First Name' : 'Last Name'}
              </label>
              <input
                type="text"
                value={(profile ?? initial)[field] ?? ''}
                onChange={(e) => setProfile((p) => ({ ...(p ?? initial), [field]: e.target.value }))}
                className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200"
                style={inputStyle()}
                onFocus={(e) => { e.target.style.borderColor = '#C9A84C'; e.target.style.boxShadow = '0 0 0 1px #C9A84C'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
            Email Address
          </label>
          <input
            type="email"
            value={(profile ?? initial).email ?? ''}
            onChange={(e) => setProfile((p) => ({ ...(p ?? initial), email: e.target.value }))}
            className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200"
            style={inputStyle()}
            onFocus={(e) => { e.target.style.borderColor = '#C9A84C'; e.target.style.boxShadow = '0 0 0 1px #C9A84C'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
            Phone
          </label>
          <input
            type="tel"
            value={(profile as CustomerProfile | null)?.phone ?? ''}
            onChange={(e) => setProfile((p) => ({ ...(p ?? initial), phone: e.target.value }))}
            className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200"
            style={inputStyle()}
            onFocus={(e) => { e.target.style.borderColor = '#C9A84C'; e.target.style.boxShadow = '0 0 0 1px #C9A84C'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 rounded text-sm font-semibold tracking-wide transition-all duration-200"
          style={{
            backgroundColor: isSaving ? '#D4B96B' : '#C9A84C',
            color: '#0F1328',
            fontFamily: 'var(--font-body)',
            cursor: isSaving ? 'not-allowed' : 'pointer',
          }}
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}


function WishlistSection() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWishlist()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleRemove(id: number) {
    await removeWishlistItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">&#9825;</div>
        <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
          Your wishlist is empty.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-4 px-5 py-2 rounded text-sm font-semibold no-underline"
          style={{ backgroundColor: '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)' }}
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="wishlist-section" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => {
        const imageUrl = item.product.primary_image || item.product.images?.[0]?.image || null;
        return (
          <div key={item.id} className="flex gap-4 rounded-lg p-4"
            style={{ border: '1px solid #E5E7EB', backgroundColor: '#FAFAFA' }}>
            {imageUrl ? (
              <img src={imageUrl} alt={item.product.name}
                className="w-20 h-20 object-cover rounded flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: '#F3F4F6' }}>
                <span style={{ color: '#C9A84C', fontSize: 24 }}>&#9670;</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link
                to={'/products/' + item.product.slug}
                className="block text-sm font-semibold truncate no-underline hover:text-[#C9A84C]"
                style={{ color: '#1A1F3A', fontFamily: 'var(--font-body)' }}
              >
                {item.product.name}
              </Link>
              {item.product.price && (
                <p className="text-sm mt-0.5" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                  &pound;{parseFloat(item.product.price).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </p>
              )}
              {item.product.is_price_on_request && (
                <p className="text-sm mt-0.5 italic" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
                  Price on Request
                </p>
              )}
              <button
                onClick={() => handleRemove(item.id)}
                className="mt-2 text-xs font-semibold transition-colors hover:text-[#DC2626]"
                style={{ color: '#9CA3AF', fontFamily: 'var(--font-body)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AccountPage() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    getOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated]);

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/account' }} replace />;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'orders', label: 'Orders' },
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'profile', label: 'Profile' },
  ];

  return (
    <main className="min-h-screen pt-32 pb-16 px-4" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="max-w-5xl mx-auto">
        {/* Page heading */}
        <div className="mb-8">
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}
          >
            My Account
          </h1>
          {user && (
            <p className="text-sm mt-1" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
              Welcome back, {user.first_name || user.email}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left sidebar ── */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <nav
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="w-full text-left px-5 py-3.5 text-sm font-semibold transition-colors duration-150"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: activeTab === tab.key ? '#C9A84C' : '#2C2C2C',
                    backgroundColor: activeTab === tab.key ? '#FFFBF0' : 'transparent',
                    borderLeft: activeTab === tab.key ? '3px solid #C9A84C' : '3px solid transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}

              <div className="h-px mx-4" style={{ backgroundColor: '#E5E7EB' }} />

              <button
                data-testid="logout-btn"
                onClick={logout}
                className="w-full text-left px-5 py-3.5 text-sm font-semibold transition-colors duration-150"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: '#DC2626',
                  borderLeft: '3px solid transparent',
                }}
              >
                Logout
              </button>
            </nav>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1">
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
            >
              <h2
                className="text-xl font-semibold mb-1"
                style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}
              >
                {activeTab === 'orders' ? 'Order History' : activeTab === 'wishlist' ? 'My Wishlist' : 'Profile Details'}
              </h2>
              <div className="w-10 h-0.5 mb-6" style={{ backgroundColor: '#C9A84C' }} />

              {activeTab === 'orders' && (
                <OrdersSection orders={orders} isLoading={ordersLoading} />
              )}
              {activeTab === 'wishlist' && <WishlistSection />}
              {activeTab === 'profile' && <ProfileSection />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
