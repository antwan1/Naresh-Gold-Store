import { test, expect } from '../fixtures/auth.fixture'

test.describe('Cart API', () => {
  test('401 without auth', async ({ api }) => {
    expect((await api.get('/api/cart/')).status()).toBe(401)
    expect((await api.post('/api/cart/', { data: { product: 1, quantity: 1 } })).status()).toBe(401)
  })

  test('get cart — returns items and total', async ({ authedApi }) => {
    const res = await authedApi.get('/api/cart/')
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data).toHaveProperty('items')
    expect(data).toHaveProperty('total')
    expect(data).toHaveProperty('item_count')
  })

  test('add item to cart', async ({ authedApi, api }) => {
    const product = (await (await api.get('/api/products/?metal_type=gold')).json()).results[0]
    const res = await authedApi.post('/api/cart/', {
      data: { product: product.id, quantity: 1 },
    })
    expect(res.status()).toBe(201)
    const data = await res.json()
    expect(data.items.length).toBeGreaterThan(0)
  })

  test('update quantity', async ({ authedApi, api }) => {
    // Ensure item in cart
    const product = (await (await api.get('/api/products/?metal_type=gold')).json()).results[0]
    await authedApi.post('/api/cart/', { data: { product: product.id, quantity: 1 } })

    const cart = await (await authedApi.get('/api/cart/')).json()
    const item = cart.items.find((i: any) => i.product.id === product.id)
    expect(item).toBeTruthy()

    const res = await authedApi.put(`/api/cart/${item.id}/`, { data: { quantity: 3 } })
    expect(res.ok()).toBeTruthy()
    expect((await res.json()).quantity).toBe(3)
  })

  test('remove item', async ({ authedApi, api }) => {
    const product = (await (await api.get('/api/products/?metal_type=silver')).json()).results[0]
    await authedApi.post('/api/cart/', { data: { product: product.id, quantity: 1 } })

    const cart = await (await authedApi.get('/api/cart/')).json()
    const item = cart.items.find((i: any) => i.product.id === product.id)
    expect(item).toBeTruthy()

    expect((await authedApi.delete(`/api/cart/${item.id}/`)).status()).toBe(204)
  })
})
