import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Book Appointment', to: '/appointments' },
  { label: 'Sell Your Gold', to: '/sell-gold' },
  { label: 'Bespoke Jewellery', to: '/custom-jewellery' },
];

const SOCIAL_LINKS = [
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaWhatsapp, href: 'https://wa.me/44xxxxxxxxxx', label: 'WhatsApp' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  }

  return (
    <footer style={{ backgroundColor: '#0F1328' }}>
      {/* Gold divider */}
      <div className="w-full h-px" style={{ backgroundColor: '#C9A84C' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — About */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-xl font-semibold tracking-widest uppercase"
              style={{ color: '#C9A84C', fontFamily: 'var(--font-heading)' }}
            >
              Naresh Jewellers
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#E5E7EB', fontFamily: 'var(--font-body)' }}>
              Crafting timeless jewellery with love and tradition. Specialists in gold, silver, diamond, and South-East Asian designs since 1985.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4 mt-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-colors duration-200 hover:opacity-80"
                  style={{ color: '#C9A84C' }}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm no-underline transition-colors duration-200 hover:text-[#C9A84C]"
                    style={{ color: '#E5E7EB', fontFamily: 'var(--font-body)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact Info */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}
            >
              Contact Us
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt
                  size={14}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: '#C9A84C' }}
                />
                <span className="text-sm leading-relaxed" style={{ color: '#E5E7EB', fontFamily: 'var(--font-body)' }}>
                  123 Jewellers Row<br />
                  Birmingham, B18 6NF<br />
                  United Kingdom
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone size={13} style={{ color: '#C9A84C' }} />
                <a
                  href="tel:+441217001234"
                  className="text-sm no-underline hover:text-[#C9A84C] transition-colors duration-200"
                  style={{ color: '#E5E7EB', fontFamily: 'var(--font-body)' }}
                >
                  +44 121 700 1234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope size={13} style={{ color: '#C9A84C' }} />
                <a
                  href="mailto:info@nareshjewellers.co.uk"
                  className="text-sm no-underline hover:text-[#C9A84C] transition-colors duration-200"
                  style={{ color: '#E5E7EB', fontFamily: 'var(--font-body)' }}
                >
                  info@nareshjewellers.co.uk
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaClock size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                <span className="text-sm leading-relaxed" style={{ color: '#E5E7EB', fontFamily: 'var(--font-body)' }}>
                  Mon–Sat: 10:00 – 18:00<br />
                  Sunday: 11:00 – 16:00
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}
            >
              Newsletter
            </h4>
            <p className="text-sm" style={{ color: '#E5E7EB', fontFamily: 'var(--font-body)' }}>
              Stay updated with new collections, gold prices, and exclusive offers.
            </p>
            {subscribed ? (
              <p className="text-sm font-semibold" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
                Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-2.5 rounded text-sm outline-none transition-colors duration-200"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C9A84C';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                  }}
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: '#C9A84C',
                    color: '#0F1328',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t w-full"
        style={{ borderColor: 'rgba(201,168,76,0.15)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p
            className="text-xs"
            style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
          >
            &copy; {new Date().getFullYear()} Naresh Jewellers. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}
          >
            Designed with care for timeless elegance.
          </p>
        </div>
      </div>
    </footer>
  );
}
