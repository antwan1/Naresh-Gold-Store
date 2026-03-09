import { test, expect } from '../fixtures/auth.fixture'

test.describe('Products API', () => {
  test('GET /api/products/ — returns paginated list', async ({ api }) => {
    const res = await api.get('/api/products/')
    expect(res.ok()).toBeTruthy()

    const data = await res.json()
    expect(data.results).toBeInstanceOf(Array)
    expect(data.results.length).toBeGreaterThan(0)

    const product = data.results[0]
    expect(product).toHaveProperty('id')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('slug')
    expect(product).toHaveProperty('metal_type')
    expect(product).toHaveProperty('images')
  })

  test('filters by category slug', async ({ api }) => {
    const res = await api.get('/api/products/?category=gold')
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.results.length).toBeGreaterThan(0)
    for (const product of data.results) {
      expect(product.category.slug).toBe('gold')
    }
  })

  test('filters by metal type', async ({ api }) => {
    const res = await api.get('/api/products/?metal_type=silver')
    expect(res.ok()).toBeTruthy()
    for (const p of (await res.json()).results) {
      expect(p.metal_type).toBe('silver')
    }
  })

  test('filters by price range', async ({ api }) => {
    const res = await api.get('/api/products/?price_min=100&price_max=1000')
    expect(res.ok()).toBeTruthy()
    for (const p of (await res.json()).results) {
      if (p.price !== null) {
        const price = parseFloat(p.price)
        expect(price).toBeGreaterThanOrEqual(100)
        expect(price).toBeLessThanOrEqual(1000)
      }
    }
  })

  test('sorts by price ascending', async ({ api }) => {
    const res = await api.get('/api/products/?ordering=price')
    const results = (await res.json()).results
    const prices = results
      .filter((p: any) => p.price !== null)
      .map((p: any) => parseFloat(p.price))
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  test('only returns active products', async ({ api }) => {
    const data = await (await api.get('/api/products/')).json()
    for (const p of data.results) {
      expect(p.is_active).toBe(true)
    }
  })

  test('GET /api/products/:slug/ — returns detail with images', async ({ api }) => {
    const first = (await (await api.get('/api/products/')).json()).results[0]
    const res = await api.get(`/api/products/${first.slug}/`)
    expect(res.ok()).toBeTruthy()
    const product = await res.json()
    expect(product.slug).toBe(first.slug)
    expect(product.images).toBeInstanceOf(Array)
    expect(product).toHaveProperty('description')
  })

  test('GET /api/products/:slug/ — 404 for non-existent slug', async ({ api }) => {
    const res = await api.get('/api/products/this-product-does-not-exist-99999/')
    expect(res.status()).toBe(404)
  })

  test('GET /api/categories/ — returns list with slugs', async ({ api }) => {
    const res = await api.get('/api/categories/')
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('slug')
    expect(data[0]).toHaveProperty('product_count')
  })

  test('featured filter returns only featured products', async ({ api }) => {
    const res = await api.get('/api/products/?is_featured=true')
    expect(res.ok()).toBeTruthy()
    for (const p of (await res.json()).results) {
      expect(p.is_featured).toBe(true)
    }
  })
})
