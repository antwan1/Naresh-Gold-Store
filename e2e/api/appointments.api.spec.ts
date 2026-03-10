import { test, expect } from '../fixtures/auth.fixture'

function futureDate(daysAhead = 7): string {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().split('T')[0]
}

test.describe('Appointments API', () => {
  test('book appointment', async ({ api }) => {
    const res = await api.post('/api/appointments/', {
      data: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '07700900000',
        date: futureDate(),
        time_slot: '11:00',
        purpose: 'consultation',
      },
    })
    expect(res.status()).toBe(201)
    const data = await res.json()
    expect(data).toHaveProperty('id')
    expect(data.status).toBe('pending')
  })

  test('rejects past dates', async ({ api }) => {
    const res = await api.post('/api/appointments/', {
      data: {
        name: 'Test',
        email: 'test@example.com',
        phone: '07700900000',
        date: '2020-01-01',
        time_slot: '10:00',
        purpose: 'consultation',
      },
    })
    expect(res.status()).toBe(400)
  })

  test('400 on missing required fields', async ({ api }) => {
    const res = await api.post('/api/appointments/', { data: { name: 'Test' } })
    expect(res.status()).toBe(400)
  })

  test('no auth required — public endpoint', async ({ api }) => {
    const res = await api.post('/api/appointments/', {
      data: {
        name: 'Guest',
        email: 'guest@example.com',
        phone: '07700900001',
        date: futureDate(14),
        time_slot: '14:00',
        purpose: 'general',
      },
    })
    expect(res.ok()).toBeTruthy()
  })
})
