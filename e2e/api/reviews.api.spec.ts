import { test, expect } from '../fixtures/auth.fixture'

test.describe('Reviews API', () => {
  test('public endpoint returns only approved reviews', async ({ api }) => {
    const products = await (await api.get('/api/products/')).json()
    const productId = products.results[0].id
    const res = await api.get(`/api/reviews/${productId}/`)
    expect(res.status()).toBe(200)
    const reviews = await res.json()
    expect(Array.isArray(reviews)).toBe(true)
    for (const r of reviews) {
      expect(r.is_approved).toBe(true)
    }
  })

  test('401 without auth when submitting review', async ({ api }) => {
    const products = await (await api.get('/api/products/')).json()
    const productId = products.results[0].id
    const res = await api.post('/api/reviews/', {
      data: { product: productId, rating: 5, title: 'Great', text: 'Loved it' },
    })
    expect(res.status()).toBe(401)
  })

  test('authenticated user can submit review', async ({ authedApi }) => {
    const products = await (await authedApi.get('/api/products/')).json()
    const productId = products.results[0].id
    const res = await authedApi.post('/api/reviews/', {
      data: { product: productId, rating: 4, title: 'Beautiful', text: 'Excellent craftsmanship.' },
    })
    // 201 created or 400 if already reviewed (idempotent for test reruns)
    expect([201, 400]).toContain(res.status())
    if (res.status() === 201) {
      const data = await res.json()
      expect(data).toHaveProperty('id')
      expect(data.rating).toBe(4)
      expect(data.is_approved).toBe(false) // pending moderation
    }
  })

  test('rating validation — rejects out-of-range value', async ({ authedApi }) => {
    const products = await (await authedApi.get('/api/products/')).json()
    const productId = products.results[0].id
    const res = await authedApi.post('/api/reviews/', {
      data: { product: productId, rating: 6, title: 'Bad', text: 'Test' },
    })
    expect(res.status()).toBe(400)
  })
})
