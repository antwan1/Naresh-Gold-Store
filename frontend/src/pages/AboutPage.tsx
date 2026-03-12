import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const VALUES = [
  { icon: '♦', title: 'Master Craftsmanship', body: 'Every piece is handcrafted by our skilled artisans with decades of experience, ensuring each jewel meets our exacting standards.' },
  { icon: '⚖', title: 'Certified Quality', body: 'All our gold and gemstones are hallmarked and certified, giving you complete confidence in what you wear.' },
  { icon: '♡', title: 'Family Legacy', body: 'Founded in 1972, Naresh Jewellers has been trusted by families across Birmingham for three generations.' },
  { icon: '✦', title: 'Bespoke Service', body: 'From custom engagement rings to wedding sets, we work with you to create jewellery that tells your story.' },
];

const TEAM = [
  { name: 'Naresh Kumar', role: 'Founder & Master Jeweller', initials: 'NK' },
  { name: 'Raj Kumar', role: 'Head of Design', initials: 'RK' },
  { name: 'Priya Sharma', role: 'Client Relations', initials: 'PS' },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-16" style={{ backgroundColor: '#FAF9F6' }}>
      <Helmet>
        <title>About Naresh Jewellers — Handcrafted Jewellery Since 1972</title>
        <meta name="description" content="Learn about Naresh Jewellers — a family-run jewellery business in Birmingham crafting exquisite gold and diamond pieces since 1972." />
        <meta property="og:title" content="About Naresh Jewellers" />
        <meta property="og:description" content="Three generations of master jewellery craftsmanship in the heart of Birmingham." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section
        className="relative flex items-center justify-center py-24 px-4 mb-16"
        style={{ background: 'linear-gradient(135deg, #1A1F3A 0%, #0F1328 100%)' }}
      >
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
            Est. 1972
          </p>
          <h1 className="text-4xl sm:text-5xl font-normal mb-4" style={{ color: '#FAF9F6', fontFamily: 'var(--font-display)' }}>
            {t('about.title')}
          </h1>
          <div className="w-16 h-px mx-auto mb-6" style={{ backgroundColor: '#C9A84C' }} />
          <p className="text-base" style={{ color: '#D1D5DB', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
              Our Story
            </h2>
            <div className="w-10 h-0.5 mb-6" style={{ backgroundColor: '#C9A84C' }} />
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
              <p>
                Naresh Jewellers was born in 1972 when our founder, Naresh Kumar, opened a small workshop in the heart of Birmingham's Jewellery Quarter. His philosophy was simple: create pieces of extraordinary beauty using the finest materials and time-honoured techniques.
              </p>
              <p>
                Over fifty years later, that same passion runs through everything we do. Our collection spans intricate bridal sets, elegant everyday wear, and bespoke commissions — all crafted with the same care and attention that built our reputation.
              </p>
              <p>
                Today, the second and third generations of the Kumar family carry forward that legacy, blending traditional craftsmanship with contemporary design to create jewellery that resonates across cultures and generations.
              </p>
            </div>
          </div>
          <div
            className="rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#1A1F3A', minHeight: '280px', background: 'linear-gradient(135deg, #1A1F3A 0%, #2a3160 100%)' }}
          >
            <div className="text-center p-8">
              <span className="text-7xl" style={{ color: '#C9A84C', opacity: 0.4 }}>♦</span>
              <p className="mt-4 text-sm tracking-widest uppercase" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
                Naresh Jewellers
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                Birmingham · Since 1972
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
            Our Values
          </h2>
          <div className="w-10 h-0.5 mx-auto" style={{ backgroundColor: '#C9A84C' }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-xl p-6"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
            >
              <div className="text-2xl mb-3" style={{ color: '#C9A84C' }}>{v.icon}</div>
              <h3 className="text-base font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                {v.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
            Meet the Team
          </h2>
          <div className="w-10 h-0.5 mx-auto" style={{ backgroundColor: '#C9A84C' }} />
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {TEAM.map((member) => (
            <div key={member.name} className="text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold"
                style={{ backgroundColor: '#1A1F3A', color: '#C9A84C', fontFamily: 'var(--font-body)' }}
              >
                {member.initials}
              </div>
              <p className="text-sm font-semibold" style={{ color: '#1A1F3A', fontFamily: 'var(--font-body)' }}>
                {member.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4">
        <div
          className="max-w-2xl mx-auto rounded-xl px-8 py-12"
          style={{ backgroundColor: '#1A1F3A' }}
        >
          <h2 className="text-2xl font-normal mb-3" style={{ color: '#FAF9F6', fontFamily: 'var(--font-heading)' }}>
            Visit Us in Birmingham
          </h2>
          <p className="text-sm mb-6" style={{ color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>
            Come and see our collection in person. We would love to meet you.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/shop"
              className="px-6 py-3 rounded text-sm font-semibold no-underline transition-all duration-200"
              style={{ backgroundColor: '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)' }}
            >
              Browse Collection
            </Link>
            <Link
              to="/appointments"
              className="px-6 py-3 rounded text-sm font-semibold no-underline transition-all duration-200"
              style={{ backgroundColor: 'transparent', color: '#C9A84C', border: '1px solid #C9A84C', fontFamily: 'var(--font-body)' }}
            >
              Book a Visit
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
