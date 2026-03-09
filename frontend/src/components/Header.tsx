import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

const NAV_LINKS = [
  { label: 'Home', to: '/', key: 'home' },
  { label: 'Shop', to: '/shop', key: 'shop' },
  { label: 'About', to: '/about', key: 'about' },
  { label: 'Contact', to: '/contact', key: 'contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        data-testid="header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-md shadow-[0_4px_24px_rgba(15,19,40,0.4)]'
            : 'shadow-[0_2px_12px_rgba(15,19,40,0.2)]'
        }`}
        style={{ backgroundColor: '#1A1F3A' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 no-underline"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span
                className="text-xl sm:text-2xl font-semibold tracking-widest uppercase"
                style={{ color: '#C9A84C', letterSpacing: '0.15em' }}
              >
                Naresh Jewellers
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              data-testid="desktop-nav"
              className="hidden md:flex items-center gap-8"
            >
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.key}
                    to={link.to}
                    data-testid={`nav-${link.key}`}
                    className={`relative text-sm font-semibold tracking-wide transition-colors duration-200 pb-0.5 no-underline ${
                      isActive ? 'text-[#C9A84C]' : 'text-white hover:text-[#D4B96B]'
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-px"
                        style={{ backgroundColor: '#C9A84C' }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center text-white hover:text-[#C9A84C] transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <FaShoppingCart size={20} />
                <span
                  data-testid="cart-count"
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    backgroundColor: '#C9A84C',
                    color: '#0F1328',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  0
                </span>
              </Link>

              {/* Mobile hamburger */}
              <button
                data-testid="mobile-menu-btn"
                className="md:hidden text-white hover:text-[#C9A84C] transition-colors duration-200 p-1"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay nav */}
      {mobileOpen && (
        <nav
          data-testid="mobile-nav"
          className="fixed inset-0 z-40 flex flex-col items-center justify-center"
          style={{ backgroundColor: '#1A1F3A' }}
        >
          {/* Close button */}
          <button
            className="absolute top-5 right-5 text-white hover:text-[#C9A84C] transition-colors duration-200"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes size={26} />
          </button>

          <div className="flex flex-col items-center gap-8">
            {NAV_LINKS.map((link, i) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.key}
                  to={link.to}
                  data-testid={`nav-${link.key}`}
                  className={`text-3xl font-light tracking-widest uppercase no-underline transition-colors duration-200 animate-fade-in-up stagger-${i + 1} ${
                    isActive ? 'text-[#C9A84C]' : 'text-white hover:text-[#C9A84C]'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Decorative gold line at bottom */}
          <div
            className="absolute bottom-10 w-16 h-px"
            style={{ backgroundColor: '#C9A84C' }}
          />
        </nav>
      )}
    </>
  );
}
