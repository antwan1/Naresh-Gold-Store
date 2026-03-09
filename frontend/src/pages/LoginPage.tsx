import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect back to the page they came from, or home
  const from = (location.state as { from?: string })?.from ?? '/';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string; non_field_errors?: string[] } } })
          ?.response?.data?.detail ??
        (err as { response?: { data?: { non_field_errors?: string[] } } })
          ?.response?.data?.non_field_errors?.[0] ??
        'Invalid email or password.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ backgroundColor: '#1A1F3A' }}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-2xl px-8 py-10"
        style={{ backgroundColor: '#FAF9F6' }}
      >
        {/* Logo / heading */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-semibold mb-1"
            style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}
          >
            Welcome Back
          </h1>
          <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
            Sign in to your Naresh Jewellers account
          </p>
          {/* Gold divider */}
          <div className="w-12 h-0.5 mx-auto mt-4" style={{ backgroundColor: '#C9A84C' }} />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Error message */}
          {error && (
            <div
              data-testid="login-error"
              className="mb-5 px-4 py-3 rounded text-sm"
              style={{
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                fontFamily: 'var(--font-body)',
                border: '1px solid #FECACA',
              }}
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="login-email"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              data-testid="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200"
              style={{
                border: '1px solid #E5E7EB',
                fontFamily: 'var(--font-body)',
                color: '#2C2C2C',
                backgroundColor: '#FFFFFF',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#C9A84C';
                e.target.style.boxShadow = '0 0 0 1px #C9A84C';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
            >
              Password
            </label>
            <input
              id="login-password"
              data-testid="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200"
              style={{
                border: '1px solid #E5E7EB',
                fontFamily: 'var(--font-body)',
                color: '#2C2C2C',
                backgroundColor: '#FFFFFF',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#C9A84C';
                e.target.style.boxShadow = '0 0 0 1px #C9A84C';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            data-testid="login-submit"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded text-sm font-semibold tracking-wide transition-all duration-200"
            style={{
              backgroundColor: isSubmitting ? '#D4B96B' : '#C9A84C',
              color: '#0F1328',
              fontFamily: 'var(--font-body)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
          <span className="text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
            or
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
        </div>

        {/* Register link */}
        <p className="text-center text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold no-underline hover:underline"
            style={{ color: '#C9A84C' }}
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
