import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const RING_SIZES = [
  { uk: 'H', us: '4', eu: '46.5', diameter: '14.8mm' },
  { uk: 'J', us: '4¾', eu: '48.7', diameter: '15.5mm' },
  { uk: 'L', us: '5¾', eu: '51.2', diameter: '16.3mm' },
  { uk: 'M', us: '6¼', eu: '52.5', diameter: '16.7mm' },
  { uk: 'N', us: '6¾', eu: '53.8', diameter: '17.1mm' },
  { uk: 'O', us: '7¼', eu: '55.1', diameter: '17.5mm' },
  { uk: 'P', us: '7¾', eu: '56.3', diameter: '17.9mm' },
  { uk: 'Q', us: '8¼', eu: '57.6', diameter: '18.3mm' },
  { uk: 'R', us: '8¾', eu: '58.9', diameter: '18.7mm' },
  { uk: 'S', us: '9¼', eu: '60.2', diameter: '19.1mm' },
  { uk: 'T', us: '9¾', eu: '61.4', diameter: '19.5mm' },
  { uk: 'U', us: '10¼', eu: '62.7', diameter: '19.9mm' },
  { uk: 'V', us: '10¾', eu: '64.0', diameter: '20.3mm' },
  { uk: 'W', us: '11¼', eu: '65.3', diameter: '20.7mm' },
];

const BANGLE_SIZES = [
  { size: 'XS (2/2)', diameter: '52mm', circumference: '163mm' },
  { size: 'S (2/4)', diameter: '55mm', circumference: '172mm' },
  { size: 'M (2/6)', diameter: '58mm', circumference: '182mm' },
  { size: 'L (2/8)', diameter: '62mm', circumference: '194mm' },
  { size: 'XL (2/10)', diameter: '65mm', circumference: '204mm' },
  { size: 'XXL (2/12)', diameter: '68mm', circumference: '213mm' },
];

interface SizeGuideModalProps {
  onClose: () => void;
}

export default function SizeGuideModal({ onClose }: SizeGuideModalProps) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(15,19,40,0.7)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl"
          style={{ backgroundColor: '#FFFFFF' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="sticky top-0 flex items-center justify-between px-6 py-4 z-10"
            style={{ backgroundColor: '#1A1F3A', borderRadius: '12px 12px 0 0' }}
          >
            <div>
              <h2 className="text-lg font-semibold" style={{ color: '#FAF9F6', fontFamily: 'var(--font-heading)' }}>
                Size Guide
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>
                Rings · Bangles
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#9CA3AF] hover:text-white transition-colors p-1"
              aria-label="Close size guide"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="px-6 py-6 space-y-8">
            {/* How to measure */}
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
                How to Measure Your Ring Size
              </h3>
              <ol className="space-y-2 text-sm" style={{ color: '#4B5563', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                <li><strong style={{ color: '#2C2C2C' }}>1.</strong> Wrap a thin strip of paper around your finger just below the knuckle.</li>
                <li><strong style={{ color: '#2C2C2C' }}>2.</strong> Mark where the paper overlaps and measure the length in mm — this is your circumference.</li>
                <li><strong style={{ color: '#2C2C2C' }}>3.</strong> Divide by π (3.14) to get your diameter, then find your size in the table below.</li>
              </ol>
              <p className="text-xs mt-3 italic" style={{ color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>
                Tip: measure in the evening when fingers are slightly larger, and avoid measuring when cold.
              </p>
            </section>

            {/* Ring size table */}
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
                Ring Sizes
              </h3>
              <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid #E5E7EB' }}>
                <table className="w-full text-sm" style={{ fontFamily: 'var(--font-body)', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F9FAFB' }}>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>UK Size</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>US Size</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>EU Size</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Inner Diameter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RING_SIZES.map((row, i) => (
                      <tr
                        key={row.uk}
                        style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}
                      >
                        <td className="px-4 py-2.5 font-semibold" style={{ color: '#1A1F3A' }}>{row.uk}</td>
                        <td className="px-4 py-2.5" style={{ color: '#4B5563' }}>{row.us}</td>
                        <td className="px-4 py-2.5" style={{ color: '#4B5563' }}>{row.eu}</td>
                        <td className="px-4 py-2.5" style={{ color: '#4B5563' }}>{row.diameter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Bangle size section */}
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
                How to Measure Your Bangle Size
              </h3>
              <ol className="space-y-2 text-sm mb-4" style={{ color: '#4B5563', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                <li><strong style={{ color: '#2C2C2C' }}>1.</strong> Cup your hand as if putting on a bangle (thumb tucked in, fingers together).</li>
                <li><strong style={{ color: '#2C2C2C' }}>2.</strong> Measure across the widest part of your hand in mm — this is the diameter.</li>
                <li><strong style={{ color: '#2C2C2C' }}>3.</strong> Match to the table below.</li>
              </ol>
              <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid #E5E7EB' }}>
                <table className="w-full text-sm" style={{ fontFamily: 'var(--font-body)', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F9FAFB' }}>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Size</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Inner Diameter</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Inner Circumference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BANGLE_SIZES.map((row, i) => (
                      <tr
                        key={row.size}
                        style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}
                      >
                        <td className="px-4 py-2.5 font-semibold" style={{ color: '#1A1F3A' }}>{row.size}</td>
                        <td className="px-4 py-2.5" style={{ color: '#4B5563' }}>{row.diameter}</td>
                        <td className="px-4 py-2.5" style={{ color: '#4B5563' }}>{row.circumference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Not sure CTA */}
            <section
              className="rounded-lg px-5 py-4 text-center"
              style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)' }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: '#1A1F3A', fontFamily: 'var(--font-body)' }}>
                Not sure of your size?
              </p>
              <p className="text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                Visit us in store — we offer free ring and bangle sizing. Or call us on{' '}
                <a href="tel:01215586966" className="underline" style={{ color: '#C9A84C' }}>0121 558 6966</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
