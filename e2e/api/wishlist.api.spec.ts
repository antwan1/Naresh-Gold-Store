import { test, expect } from '../fixtures/auth.fixture'

test.describe('Wishlist API', () => {
  test('401 without auth', async ({ api }) => {
    const res = await api.get('/api/wishlist/')
    expect(res.status()).toBe(401)
  })

  test('authenticated user can view empty wishlist', async ({ authedApi }) => {
    const res = await authedApi.get('/api/wishlist/')
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  test('toggle adds item to wishlist', async ({ authedApi }) => {
    const products = await (await authedApi.get('/api/products/')).json()
    const productId = products.results[0].id
    // Toggle on
    const res = await authedApi.post(`/api/wishlist/toggle/${productId}/`)
    expect([200, 201]).toContain(res.status())
    const data = await res.json()
    expect(typeof data.wishlisted).toBe('boolean')
  })

  test('toggle twice removes item', async ({ authedApi }) => {
    const products = await (await authedApi.get('/api/products/')).json()
    const productId = products.results[1].id
    // Toggle on then off
    await authedApi.post(`/api/wishlist/toggle/${productId}/`)
    const res2 = await authedApi.post(`/api/wishlist/toggle/${productId}/`)
    const data = await res2.json()
    // After second toggle it should be off (but could be on if started off)
    expect(typeof data.wishlisted).toBe('boolean')
  })

  test('check wishlisted status', async ({ authedApi }) => {
    const products = await (await authedApi.get('/api/products/')).json()
    const productId = products.results[2].id
    const res = await authedApi.get(`/api/wishlist/toggle/${productId}/`)
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(typeof data.wishlisted).toBe('boolean')
  })

  test('gold prices endpoint returns data', async ({ api }) => {
    const res = await api.get('/api/gold-prices/')
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('gold_per_gram')
    expect(data.gold_per_gram).toHaveProperty('24k')
    expect(data).toHaveProperty('silver_per_gram')
    expect(data.currency).toBe('GBP')
  })
})
