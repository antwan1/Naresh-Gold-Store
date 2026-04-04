import { useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from '../services/api';

export default function ResetPasswordPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!uid || !token) {
      setError('Invalid reset link.');
      return;
    }
    setIsSubmitting(true);
    try {
      await confirmPasswordReset(uid, token, password);
      navigate('/login', { state: { message: 'Password updated. Please sign in.' } });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        ?? 'This reset link is invalid or has expired.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Set New Password — Naresh Jewellers</title>
      </Helmet>
      <main className="min-h-screen flex items-center justify-center px-4 py-28" style={{ backgroundColor: '#1A1F3A' }}>
        <div className="w-full max-w-md rounded-xl shadow-2xl px-8 py-10" style={{ backgroundColor: '#FAF9F6' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
              New Password
            </h1>
            <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
              Enter and confirm your new password
            </p>
            <div className="w-12 h-0.5 mx-auto mt-4" style={{ backgroundColor: '#C9A84C' }} />
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', fontFamily: 'var(--font-body)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="new-password" className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                New Password
              </label>
              <input
                id="new-password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{ border: '1px solid #E5E7EB', fontFamily: 'var(--font-body)', color: '#2C2C2C', backgroundColor: '#FFFFFF' }}
                onFocus={(e) => { e.target.style.borderColor = '#C9A84C'; e.target.style.boxShadow = '0 0 0 1px #C9A84C'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>
                Confirm Password
              </label>
              <input
                id="confirm-password" type="password" required value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
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
              {isSubmitting ? 'Saving…' : 'Set New Password'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
