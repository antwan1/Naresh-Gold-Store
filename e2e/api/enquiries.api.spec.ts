import { test, expect } from '../fixtures/auth.fixture'

test.describe('Enquiries API', () => {
  test('submit general enquiry', async ({ api }) => {
    const res = await api.post('/api/enquiries/', {
      data: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '07700900000',
        message: 'Interested in gold bangles.',
      },
    })
    expect(res.status()).toBe(201)
    const data = await res.json()
    expect(data).toHaveProperty('id')
    expect(data.status).toBe('new')
  })

  test('submit product-specific enquiry', async ({ api }) => {
    const products = await (await api.get('/api/products/')).json()
    const productId = products.results[0].id
    const res = await api.post('/api/enquiries/', {
      data: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '07700900000',
        message: 'What is the delivery time?',
        product: productId,
      },
    })
    expect(res.status()).toBe(201)
  })

  test('400 on missing required fields', async ({ api }) => {
    const res = await api.post('/api/enquiries/', { data: { name: 'Test' } })
    expect(res.status()).toBe(400)
  })

  test('no auth required — public endpoint', async ({ api }) => {
    const res = await api.post('/api/enquiries/', {
      data: { name: 'A', email: 'a@b.com', message: 'Hello' },
    })
    expect(res.ok()).toBeTruthy()
  })
})
