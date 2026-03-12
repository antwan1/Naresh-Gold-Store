import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { submitBuyback, getGoldPrices } from '../services/api';
import type { GoldPrices } from '../types';

const ITEM_OPTIONS = [
  { value: 'jewellery', label: 'Jewellery (rings, chains, bangles…)' },
  { value: 'coins', label: 'Gold Coins / Bars' },
  { value: 'scrap', label: 'Scrap Gold' },
  { value: 'watches', label: 'Watches' },
  { value: 'other', label: 'Other' },
];

const PURITY_OPTIONS = [
  { value: '24ct', label: '24ct (999) — Pure gold' },
  { value: '22ct', label: '22ct (916) — Most Indian jewellery' },
  { value: '18ct', label: '18ct (750)' },
  { value: '14ct', label: '14ct (585)' },
  { value: '9ct', label: '9ct (375) — Most UK high-street jewellery' },
  { value: 'unknown', label: "Not sure — we'll check for you" },
];

const STEPS = [
  { icon: '📋', title: 'Submit your details', body: 'Fill in the form below with a brief description of what you have.' },
  { icon: '📞', title: 'We contact you', body: "We'll call or email you within 24 hours with a no-obligation quote." },
  { icon: '🏪', title: 'Visit the store', body: 'Bring your items in. We assess them and offer you the best price.' },
  { icon: '💷', title: 'Get paid same day', body: 'Accept our offer and receive cash or bank transfer immediately.' },
];

const inputStyle: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  fontFamily: 'var(--font-body)',
  color: '#2C2C2C',
  backgroundColor: '#FFFFFF',
};

export default function SellGoldPage() {
  const [goldPrices, setGoldPrices] = useState<GoldPrices | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [itemType, setItemType] = useState('jewellery');
  const [purity, setPurity] = useState('22ct');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getGoldPrices().then(setGoldPrices).catch(() => {});
  }, []);

  function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = '#C9A84C';
    e.target.style.boxShadow = '0 0 0 1px #C9A84C';
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await submitBuyback({
        name, email, phone, item_type: itemType, purity,
        ...(weight ? { estimated_weight: weight } : {}),
        ...(description ? { description } : {}),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-16" style={{ backgroundColor: '#FAF9F6' }}>
      <Helmet>
        <title>Sell Your Gold — Naresh Jewellers Birmingham</title>
        <meta name="description" content="Get the best price for your gold jewellery, coins and scrap gold at Naresh Jewellers, Birmingham. Same-day payment, honest valuations." />
        <meta property="og:title" content="Sell Your Gold — Naresh Jewellers" />
        <meta property="og:description" content="Get the best price for your gold at Naresh Jewellers, Birmingham. Same-day payment." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Naresh Jewellers" />
      </Helmet>

      {/* Hero */}
      <section
        className="py-16 px-4 mb-12"
        style={{ background: 'linear-gradient(135deg, #1A1F3A 0%, #0F1328 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
            We Buy Gold
          </p>
          <h1 className="text-4xl sm:text-5xl font-normal mb-4" style={{ color: '#FAF9F6', fontFamily: 'var(--font-display)' }}>
            Sell Your Gold
          </h1>
          <div className="w-16 h-px mx-auto mb-6" style={{ backgroundColor: '#C9A84C' }} />
          <p className="text-base" style={{ color: '#D1D5DB', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>
            We offer fair, transparent prices for gold jewellery, coins, scrap and more.
            Get a no-obligation quote and same-day payment.
          </p>
        </div>
      </section>

      {/* Live gold prices */}
      {goldPrices && (
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="rounded-xl p-6" style={{ backgroundColor: '#1A1F3A', border: '1px solid rgba(201,168,76,0.3)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
              Today's Gold Prices (per gram)
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: '24ct', price: goldPrices.gold_per_gram['24k'] },
                { label: '22ct', price: goldPrices.gold_per_gram['22k'] },
                { label: '18ct', price: goldPrices.gold_per_gram['18k'] },
              ].map(({ label, price }) => (
                <div key={label} className="rounded-lg py-3 px-2" style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
                  <p className="text-xs mb-1" style={{ color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>{label}</p>
                  <p className="text-lg font-bold" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
                    £{price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-center mt-3" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
              Live market rates · We offer competitive prices based on current spot values
            </p>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-semibold text-center mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
          How It Works
        </h2>
        <div className="w-10 h-0.5 mx-auto mb-8" style={{ backgroundColor: '#C9A84C' }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl"
                style={{ backgroundColor: '#1A1F3A', border: '2px solid rgba(201,168,76,0.4)' }}
              >
                {step.icon}
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#1A1F3A', fontFamily: 'var(--font-body)' }}>
                {step.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-xl mx-auto px-4">
        <div className="rounded-xl p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          {submitted ? (
            <div data-testid="buyback-success" className="text-center py-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#D1FAE5' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                Request Received!
              </h2>
              <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                Thank you. We will be in touch within 24 hours with a quote.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                Get a Free Quote
              </h2>
              <div className="w-10 h-0.5 mb-6" style={{ backgroundColor: '#C9A84C' }} />

              {error && (
                <div className="mb-4 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', fontFamily: 'var(--font-body)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Your Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Phone *</label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Email Address *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Item Type *</label>
                    <select value={itemType} onChange={(e) => setItemType(e.target.value)} required
                      className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      {ITEM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Gold Purity *</label>
                    <select value={purity} onChange={(e) => setPurity(e.target.value)} required
                      className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      {PURITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                    Estimated Weight <span className="font-normal" style={{ color: '#6B7280' }}>(optional)</span>
                  </label>
                  <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)}
                    placeholder='e.g. "10g" or "approx 2 tola"'
                    className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                    Description <span className="font-normal" style={{ color: '#6B7280' }}>(optional)</span>
                  </label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us more about your items — e.g. bangles, necklace, broken chain…"
                    className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200 resize-y"
                    style={{ ...inputStyle, minHeight: '80px' }} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded text-sm font-semibold tracking-wide transition-all duration-200"
                  style={{ backgroundColor: isSubmitting ? '#D4B96B' : '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Sending…' : 'Get a Free Quote'}
                </button>

                <p className="text-xs text-center" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                  No obligation · We'll contact you within 24 hours
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
