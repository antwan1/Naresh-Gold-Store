import { useState } from 'react';
import { bookAppointment } from '../services/api';

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                    '15:00', '15:30', '16:00', '16:30', '17:00'];

const inputStyle: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  fontFamily: 'var(--font-body)',
  color: '#2C2C2C',
  backgroundColor: '#FFFFFF',
};

export default function AppointmentPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [purpose, setPurpose] = useState('consultation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!timeSlot) { setError('Please select a time slot.'); return; }
    setIsSubmitting(true);
    setError('');
    try {
      await bookAppointment({ name, email, phone, date, time_slot: timeSlot, purpose });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.target.style.borderColor = '#C9A84C';
    e.target.style.boxShadow = '0 0 0 1px #C9A84C';
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="max-w-xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
            Book a Visit
          </h1>
          <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: '#C9A84C' }} />
          <p className="mt-4 text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
            Come see our collection in person. Book a private viewing at our store.
          </p>
        </div>
        <div className="rounded-xl p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          {submitted ? (
            <div data-testid="appointment-success" className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#D1FAE5' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A1F3A' }}>
                Appointment Booked!
              </h2>
              <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
                We look forward to seeing you. You will receive a confirmation shortly.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', fontFamily: 'var(--font-body)' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Your Name *</label>
                    <input data-testid="appointment-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Phone *</label>
                    <input data-testid="appointment-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Email Address *</label>
                  <input data-testid="appointment-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Preferred Date *</label>
                    <input data-testid="appointment-date" type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Purpose *</label>
                    <select data-testid="appointment-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full rounded px-4 py-3 text-sm outline-none transition-all duration-200" style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      <option value="consultation">Consultation</option>
                      <option value="repair">Repair</option>
                      <option value="valuation">Valuation</option>
                      <option value="general">General Enquiry</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2C2C2C', fontFamily: 'var(--font-body)' }}>Preferred Time *</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button key={slot} type="button" data-testid="appointment-time" onClick={() => setTimeSlot(slot)} className="px-2 py-2 rounded text-xs font-semibold transition-all duration-150" style={{ backgroundColor: timeSlot === slot ? '#C9A84C' : '#F9FAFB', color: timeSlot === slot ? '#0F1328' : '#2C2C2C', border: timeSlot === slot ? '1px solid #C9A84C' : '1px solid #E5E7EB', fontFamily: 'var(--font-body)' }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <button data-testid="appointment-submit" type="submit" disabled={isSubmitting} className="w-full px-6 py-3 rounded text-sm font-semibold tracking-wide transition-all duration-200 mt-2" style={{ backgroundColor: isSubmitting ? '#D4B96B' : '#C9A84C', color: '#0F1328', fontFamily: 'var(--font-body)', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Booking...' : 'Book Appointment'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
