import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4"
      style={{ backgroundColor: '#1A1F3A', borderTop: '1px solid rgba(201,168,76,0.3)' }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-between">
        <p className="text-sm text-center sm:text-left" style={{ color: '#E5E7EB', fontFamily: 'var(--font-body)' }}>
          We use cookies to improve your experience. By continuing to use this site, you agree to our use of cookies.{' '}
          <Link
            to="/privacy-policy"
            className="underline hover:text-[#C9A84C] transition-colors duration-200"
            style={{ color: '#D4B96B' }}
          >
            Learn more
          </Link>
        </p>
        <button
          onClick={handleAccept}
          className="flex-shrink-0 px-6 py-2 rounded text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: '#C9A84C',
            color: '#0F1328',
            fontFamily: 'var(--font-body)',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
