import { useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      data-testid="hero-section"
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #1e2545 0%, #0F1328 65%, #090d1e 100%)',
      }}
    >
      {/* Decorative background diamond shapes */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(201,168,76,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* Subtle ornamental frame lines */}
      <div
        className="absolute top-10 left-10 w-16 h-16 pointer-events-none"
        aria-hidden="true"
        style={{
          borderTop: '1px solid rgba(201,168,76,0.3)',
          borderLeft: '1px solid rgba(201,168,76,0.3)',
        }}
      />
      <div
        className="absolute top-10 right-10 w-16 h-16 pointer-events-none"
        aria-hidden="true"
        style={{
          borderTop: '1px solid rgba(201,168,76,0.3)',
          borderRight: '1px solid rgba(201,168,76,0.3)',
        }}
      />
      <div
        className="absolute bottom-16 left-10 w-16 h-16 pointer-events-none"
        aria-hidden="true"
        style={{
          borderBottom: '1px solid rgba(201,168,76,0.3)',
          borderLeft: '1px solid rgba(201,168,76,0.3)',
        }}
      />
      <div
        className="absolute bottom-16 right-10 w-16 h-16 pointer-events-none"
        aria-hidden="true"
        style={{
          borderBottom: '1px solid rgba(201,168,76,0.3)',
          borderRight: '1px solid rgba(201,168,76,0.3)',
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in-up">
        {/* Decorative top line */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-px" style={{ backgroundColor: '#C9A84C', opacity: 0.6 }} />
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: '#C9A84C', fontFamily: 'var(--font-body)', opacity: 0.8 }}
          >
            Est. 1996
          </span>
          <div className="w-12 h-px" style={{ backgroundColor: '#C9A84C', opacity: 0.6 }} />
        </div>

        {/* Main heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight"
          style={{
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            textShadow: '0 2px 40px rgba(0,0,0,0.4)',
          }}
        >
          Exquisite Jewellery,{' '}
          <span
            className="gold-shimmer inline-block"
            style={{ WebkitTextFillColor: 'transparent' }}
          >
            Crafted with Love
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed"
          style={{
            color: 'rgba(255,255,255,0.72)',
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
          }}
        >
          Gold, Silver &amp; Diamond Collections &mdash; Handcrafted in the South-East Asian Tradition
        </p>

        {/* Gold divider */}
        <div className="w-16 h-px" style={{ backgroundColor: '#C9A84C', opacity: 0.5 }} />

        {/* CTA Button */}
        <button
          data-testid="hero-cta-btn"
          onClick={() => navigate('/shop')}
          className="mt-2 px-10 py-4 rounded text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: '#C9A84C',
            color: '#0F1328',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 0 30px rgba(201,168,76,0.25), 0 4px 16px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D4B96B';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(201,168,76,0.4), 0 4px 20px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#C9A84C';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(201,168,76,0.25), 0 4px 16px rgba(0,0,0,0.3)';
          }}
        >
          Explore Our Collection
        </button>
      </div>

      {/* Animated scroll chevron */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'var(--font-body)' }}
        >
          Scroll
        </span>
        <FaChevronDown
          size={16}
          style={{
            color: '#C9A84C',
            opacity: 0.6,
            animation: 'bounce 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Inline keyframe for bounce */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
}
