import { useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
    } catch {
      // Always show success to avoid leaking whether email is registered
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password — Naresh Jewellers</title>
      </Helmet>
      <main className="min-h-screen flex items-center justify-center px-4 py-28" style={{ backgroundColor: '#1A1F3A' }}>
        <div className="w-full max-w-md rounded-xl shadow-2xl px-8 py-10" style={{ backgroundColor: '#FAF9F6' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
              Reset Password
            </h1>
            <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
              Enter your email and we'll send you a reset link
            </p>
            <div className="w-12 h-0.5 mx-auto mt-4" style={{ backgroundColor: '#C9A84C' }} />
          </div>

          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#D1FAE5', border: '2px solid #16A34A' }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <p className="text-sm mb-6" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                If <strong>{email}</strong> is registered, you'll receive a reset link shortly. Check your inbox (and spam folder).
              </p>
              <Link to="/login" className="text-sm font-semibold no-underline hover:underline" style={{ color: '#C9A84C', fontFamily: 'var(--font-body)' }}>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-6">
                <label htmlFor="reset-email" className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                  Email Address
                </label>
                <input
                  id="reset-email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{ border: '1px solid #E5E7EB', fontFamily: 'var(--font-body)', color: '#2C2C2C', backgroundColor: '#FFFFFF' }}
                  onFocus={(e) => { e.target.style.borderColor = '#C9A84C'; e.target.style.boxShadow = '0 0 0 1px #C9A84C'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <button
                type="submit" disabled={isSubmitting}
                className="w-full py-3 rounded text-sm font-semibold tracking-wide transition-all duration-200"
                style={{ backgroundColor: isSubmitting ? '#D4B96B' : '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? 'Sending…' : 'Send Reset Link'}
              </button>
              <p className="text-center text-sm mt-6" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                Remember it?{' '}
                <Link to="/login" className="font-semibold no-underline hover:underline" style={{ color: '#C9A84C' }}>Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
