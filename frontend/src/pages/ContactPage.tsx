import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { submitEnquiry, getProduct } from '../services/api';
import type { Product } from '../types';

const inputStyle: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  fontFamily: 'var(--font-body)',
  color: '#2C2C2C',
  backgroundColor: '#FFFFFF',
};

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const productSlug = searchParams.get('product');
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productSlug) return;
    getProduct(productSlug).then((p) => {
      setProduct(p);
      setMessage('Hi, I am interested in ' + p.name + '. Could you please provide more details?');
    });
  }, [productSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await submitEnquiry({ name, email, phone: phone || undefined, message, product: product?.id });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = '#C9A84C';
    e.target.style.boxShadow = '0 0 0 1px #C9A84C';
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  }

  return (
                <>
<Helmet>
              <title>Contact & Enquiries — Naresh Jewellers</title>
              <meta name="description" content="Get in touch with Naresh Jewellers. Ask about our jewellery, pricing or book a visit." />
              <meta property="og:title" content="Contact & Enquiries — Naresh Jewellers" />
              <meta property="og:description" content="Get in touch with Naresh Jewellers. Ask about our jewellery, pricing or book a visit." />
              <meta property="og:type" content="website" />
              <meta property="og:site_name" content="Naresh Jewellers" />
            </Helmet>
    <main className="min-h-screen pt-32 pb-16 px-4" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
            Contact &amp; Enquiries
          </h1>
          <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: '#C9A84C' }} />
          <p className="mt-4 text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
            Have a question about a piece? We would love to hear from you.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <div className="rounded-xl p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
              {submitted ? (
                <div data-testid="enquiry-success" className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#D1FAE5' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                    Enquiry Sent!
                  </h2>
                  <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                    Thank you for getting in touch. We will get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <>
                  {product && (
                    <div className="mb-6 p-4 rounded-lg flex items-center gap-4" style={{ backgroundColor: '#FFFBF0', border: '1px solid #E8D5A3' }}>
                      {product.primary_image && (
                        <img src={product.primary_image} alt={product.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
                          Enquiring about
                        </p>
                        <p className="text-sm font-semibold" style={{ color: '#1A1F3A', fontFamily: 'var(--font-body)' }}>{product.name}</p>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="mb-4 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', fontFamily: 'var(--font-body)' }}>
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Your Name *</label>
                        <input data-testid="enquiry-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Email Address *</label>
                        <input data-testid="enquiry-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Phone Number</label>
                      <input data-testid="enquiry-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Message *</label>
                      <textarea data-testid="enquiry-message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200 resize-y" style={{ ...inputStyle, minHeight: '120px' }} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <button data-testid="enquiry-submit" type="submit" disabled={isSubmitting} className="w-full px-6 py-3 rounded text-sm font-semibold tracking-wide transition-all duration-200" style={{ backgroundColor: isSubmitting ? '#D4B96B' : '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                      {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-4">
            <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
              <h3 className="text-base font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>Visit Our Store</h3>
              <div className="space-y-3 text-sm" style={{ fontFamily: 'var(--font-body)', color: '#6B7280' }}>
                <p><strong>Address:</strong> 123 Jewellers Row, Birmingham, B18 6NF</p>
                <p><strong>Phone:</strong> <a href="tel:+441217001234" style={{ color: '#C9A84C' }}>+44 121 700 1234</a></p>
                <p><strong>Email:</strong> <a href="mailto:info@nareshjewellers.co.uk" style={{ color: '#C9A84C' }}>info@nareshjewellers.co.uk</a></p>
              </div>
            </div>
            <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
              <h3 className="text-base font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>Opening Hours</h3>
              <div className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-body)', color: '#6B7280' }}>
                <div className="flex justify-between"><span>Monday - Friday</span><span style={{ color: '#2C2C2C' }}>10:00 - 18:00</span></div>
                <div className="flex justify-between"><span>Saturday</span><span style={{ color: '#2C2C2C' }}>10:00 - 17:00</span></div>
                <div className="flex justify-between"><span>Sunday</span><span style={{ color: '#2C2C2C' }}>Closed</span></div>
              </div>
            </div>
            <a href="/appointments" className="block w-full text-center px-6 py-3 rounded text-sm font-semibold transition-all duration-200 no-underline" style={{ backgroundColor: '#1A1F3A', color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
              Book an Appointment
            </a>
          </aside>
        </div>
      </div>
    </main>
    </>);
}
