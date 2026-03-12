import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { submitCustomOrder } from '../services/api';

const PIECE_OPTIONS = [
  { value: 'ring', label: 'Ring' },
  { value: 'necklace', label: 'Necklace / Chain' },
  { value: 'bracelet', label: 'Bracelet / Bangle' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'pendant', label: 'Pendant' },
  { value: 'set', label: 'Jewellery Set' },
  { value: 'other', label: 'Other' },
];

const METAL_OPTIONS = [
  { value: 'gold_22ct', label: '22ct Gold' },
  { value: 'gold_18ct', label: '18ct Gold' },
  { value: 'gold_24ct', label: '24ct Gold' },
  { value: 'white_gold', label: 'White Gold' },
  { value: 'rose_gold', label: 'Rose Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'unsure', label: 'Not sure — advise me' },
];

const BUDGET_OPTIONS = [
  { value: 'under_500', label: 'Under £500' },
  { value: '500_1000', label: '£500 – £1,000' },
  { value: '1000_2500', label: '£1,000 – £2,500' },
  { value: '2500_5000', label: '£2,500 – £5,000' },
  { value: 'over_5000', label: 'Over £5,000' },
  { value: 'flexible', label: 'Flexible / Not sure' },
];

const PROCESS_STEPS = [
  { icon: '✏️', title: 'Share your vision', body: 'Fill in the form with your ideas — sketches, references, or just a description.' },
  { icon: '💬', title: 'Design consultation', body: 'We\'ll contact you within 2 business days to discuss your design in detail.' },
  { icon: '📐', title: 'Quote & approval', body: 'We\'ll provide a detailed quote. Once approved, your piece goes into production.' },
  { icon: '✨', title: 'Crafted & delivered', body: 'Your bespoke jewellery is handcrafted and ready for collection or delivery.' },
];

const inputStyle: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  fontFamily: 'var(--font-body)',
  color: '#2C2C2C',
  backgroundColor: '#FFFFFF',
};

export default function CustomJewelleryPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pieceType, setPieceType] = useState('ring');
  const [metal, setMetal] = useState('gold_22ct');
  const [budget, setBudget] = useState('flexible');
  const [description, setDescription] = useState('');
  const [occasion, setOccasion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
      await submitCustomOrder({
        name, email, phone, piece_type: pieceType, metal, budget, description,
        ...(occasion ? { occasion } : {}),
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
        <title>Bespoke Jewellery — Naresh Jewellers Birmingham</title>
        <meta name="description" content="Commission a one-of-a-kind bespoke piece at Naresh Jewellers, Birmingham. Handcrafted to your exact design in gold, silver or platinum." />
        <meta property="og:title" content="Bespoke Jewellery — Naresh Jewellers" />
        <meta property="og:description" content="Commission a one-of-a-kind bespoke piece at Naresh Jewellers, Birmingham." />
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
            Bespoke Jewellery
          </p>
          <h1 className="text-4xl sm:text-5xl font-normal mb-4" style={{ color: '#FAF9F6', fontFamily: 'var(--font-display)' }}>
            Your Vision, Handcrafted
          </h1>
          <div className="w-16 h-px mx-auto mb-6" style={{ backgroundColor: '#C9A84C' }} />
          <p className="text-base" style={{ color: '#D1D5DB', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>
            Can't find exactly what you're looking for? We'll make it for you.
            From an engagement ring to a full bridal set — every piece crafted to your exact specification.
          </p>
        </div>
      </section>

      {/* Process steps */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-semibold text-center mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
          How It Works
        </h2>
        <div className="w-10 h-0.5 mx-auto mb-8" style={{ backgroundColor: '#C9A84C' }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, i) => (
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
      <section className="max-w-2xl mx-auto px-4">
        <div className="rounded-xl p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          {submitted ? (
            <div data-testid="custom-order-success" className="text-center py-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#D1FAE5' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                Enquiry Received!
              </h2>
              <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                Thank you. We'll review your brief and be in touch within 2 business days to discuss your design.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                Commission a Bespoke Piece
              </h2>
              <div className="w-10 h-0.5 mb-6" style={{ backgroundColor: '#C9A84C' }} />

              {error && (
                <div className="mb-4 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', fontFamily: 'var(--font-body)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name + Phone */}
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

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Email Address *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>

                {/* Piece type + Metal */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Type of Piece *</label>
                    <select value={pieceType} onChange={(e) => setPieceType(e.target.value)} required
                      className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      {PIECE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Preferred Metal *</label>
                    <select value={metal} onChange={(e) => setMetal(e.target.value)} required
                      className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      {METAL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Budget + Occasion */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Approximate Budget *</label>
                    <select value={budget} onChange={(e) => setBudget(e.target.value)} required
                      className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      {BUDGET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                      Occasion <span className="font-normal" style={{ color: '#6B7280' }}>(optional)</span>
                    </label>
                    <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)}
                      placeholder="e.g. Wedding, Anniversary, Birthday…"
                      className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                    Describe Your Design *
                  </label>
                  <textarea rows={5} required value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us as much as you can — style, stone preferences, engravings, reference images you can share during our call, inspiration…"
                    className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200 resize-y"
                    style={{ ...inputStyle, minHeight: '120px' }} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded text-sm font-semibold tracking-wide transition-all duration-200"
                  style={{ backgroundColor: isSubmitting ? '#D4B96B' : '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Sending…' : 'Submit Your Brief'}
                </button>

                <p className="text-xs text-center" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                  No obligation · We'll contact you within 2 business days
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
