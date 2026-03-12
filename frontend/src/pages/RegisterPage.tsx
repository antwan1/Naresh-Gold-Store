import { useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        ...(phone ? { phone } : {}),
      });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string | string[]> } })?.response?.data;
      if (data) {
        const firstField = Object.values(data)[0];
        setError(Array.isArray(firstField) ? firstField[0] : String(firstField));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function inputClass() {
    return 'w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200';
  }

  function inputStyle(): React.CSSProperties {
    return {
      border: '1px solid #E5E7EB',
      fontFamily: 'var(--font-body)',
      color: '#2C2C2C',
      backgroundColor: '#FFFFFF',
    };
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = '#C9A84C';
    e.target.style.boxShadow = '0 0 0 1px #C9A84C';
  }
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  }

  return (
                <>
<Helmet>
              <title>Create Account — Naresh Jewellers</title>
              <meta name="description" content="Create a Naresh Jewellers account to save your wishlist and track orders." />
              <meta property="og:title" content="Create Account — Naresh Jewellers" />
              <meta property="og:description" content="Create a Naresh Jewellers account to save your wishlist and track orders." />
              <meta property="og:type" content="website" />
              <meta property="og:site_name" content="Naresh Jewellers" />
            </Helmet>
    <main
      className="min-h-screen flex items-center justify-center px-4 py-28"
      style={{ backgroundColor: '#1A1F3A' }}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-2xl px-8 py-10"
        style={{ backgroundColor: '#FAF9F6' }}
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-semibold mb-1"
            style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}
          >
            Create Account
          </h1>
          <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
            Join Naresh Jewellers for exclusive access
          </p>
          <div className="w-12 h-0.5 mx-auto mt-4" style={{ backgroundColor: '#C9A84C' }} />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Error */}
          {error && (
            <div
              data-testid="register-error"
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

          {/* First & Last name row */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label
                htmlFor="register-first-name"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
              >
                First Name
              </label>
              <input
                id="register-first-name"
                data-testid="register-first-name"
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass()}
                style={inputStyle()}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Priya"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="register-last-name"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
              >
                Last Name
              </label>
              <input
                id="register-last-name"
                data-testid="register-last-name"
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass()}
                style={inputStyle()}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Sharma"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="register-email"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
            >
              Email Address
            </label>
            <input
              id="register-email"
              data-testid="register-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass()}
              style={inputStyle()}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="register-password"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
            >
              Password
            </label>
            <input
              id="register-password"
              data-testid="register-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass()}
              style={inputStyle()}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="At least 8 characters"
            />
          </div>

          {/* Phone (optional) */}
          <div className="mb-6">
            <label
              htmlFor="register-phone"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}
            >
              Phone{' '}
              <span className="font-normal" style={{ color: '#6B7280' }}>
                (optional)
              </span>
            </label>
            <input
              id="register-phone"
              data-testid="register-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass()}
              style={inputStyle()}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="07700 900000"
            />
          </div>

          {/* Submit */}
          <button
            data-testid="register-submit"
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
            {isSubmitting ? 'Creating account…' : 'Create Account'}
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

        <p className="text-center text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold no-underline hover:underline"
            style={{ color: '#C9A84C' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
    </>);
}
