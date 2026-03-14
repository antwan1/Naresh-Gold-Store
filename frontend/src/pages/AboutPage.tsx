import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const VALUES = [
  { icon: '♦', title: 'Master Craftsmanship', body: 'Every piece in our collection is chosen and crafted with care — from intricate 22ct bridal sets to elegant everyday gold jewellery.' },
  { icon: '⚖', title: 'Hallmarked Quality', body: 'All our gold jewellery is hallmarked by the Birmingham Assay Office, giving you complete confidence and peace of mind in every purchase.' },
  { icon: '♡', title: 'Family Legacy', body: 'Established in 1996, Naresh Jewellers has spent nearly 30 years serving the Birmingham community with honesty, warmth, and expertise.' },
  { icon: '✦', title: 'Bespoke Service', body: 'From custom engagement rings to full wedding sets, we work closely with you to create jewellery that tells your unique story.' },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-16" style={{ backgroundColor: '#FAF9F6' }}>
      <Helmet>
        <title>About Naresh Jewellers — Handcrafted Jewellery Since 1996</title>
        <meta name="description" content="Learn about Naresh Jewellers — a family-run jewellery business in Birmingham crafting exquisite gold and diamond pieces since 1996." />
        <meta property="og:title" content="About Naresh Jewellers" />
        <meta property="og:description" content="Nearly 30 years of family jewellery craftsmanship in the heart of Birmingham." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section
        className="relative flex items-center justify-center py-24 px-4 mb-16"
        style={{ background: 'linear-gradient(135deg, #1A1F3A 0%, #0F1328 100%)' }}
      >
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
            Est. 1996
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
                Naresh Jewellers was founded in 1996, after our family moved to the United Kingdom. My father brought with him a deep love of jewellery and a lifelong knowledge of gold — and it was that passion that led him to open this shop on Smethwick High Street.
              </p>
              <p>
                What began as a small family business has grown into one of Birmingham's most trusted names in gold jewellery. We are proud specialists in 22ct and 24ct gold, South-East Asian bridal sets, and bespoke commissions — and we have been serving the same community for nearly 30 years.
              </p>
              <p>
                Today, I carry forward my father's legacy — with the same values he built this business on: honesty, quality, and treating every customer like family.
              </p>
            </div>
          </div>
          <div
            className="rounded-xl overflow-hidden"
            style={{ minHeight: '280px', border: '1px solid rgba(201,168,76,0.2)' }}
          >
            <img
              src="/naresh-heritage.jpg"
              alt="Naresh Jewellers — Our Story"
              className="w-full h-full object-cover"
              style={{ minHeight: '280px' }}
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = 'none';
                const parent = el.parentElement;
                if (parent) {
                  parent.style.background = 'linear-gradient(135deg, #1A1F3A 0%, #2a3160 100%)';
                  parent.innerHTML = `<div class="text-center p-8"><span style="font-size:4.5rem;color:#C9A84C;opacity:0.4">♦</span><p style="margin-top:1rem;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase;color:#C9A84C;font-family:var(--font-body)">Naresh Jewellers</p><p style="font-size:0.75rem;margin-top:0.25rem;color:#6B7280;font-family:var(--font-body)">Birmingham · Since 1996</p></div>`;
                }
              }}
            />
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

      {/* Specialities */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
            Our Specialities
          </h2>
          <div className="w-10 h-0.5 mx-auto" style={{ backgroundColor: '#C9A84C' }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          {[
            '22ct & 24ct Gold',
            'Asian Bridal Sets',
            'South-East Asian Designs',
            'Bespoke Commissions',
            'Gold Buying & Valuations',
            'Jewellery Repairs',
          ].map((spec) => (
            <div
              key={spec}
              className="rounded-lg py-4 px-3"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(201,168,76,0.3)' }}
            >
              <span className="text-lg mb-2 block" style={{ color: '#C9A84C' }}>♦</span>
              <p className="text-sm font-semibold" style={{ color: '#1A1F3A', fontFamily: 'var(--font-body)' }}>{spec}</p>
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
