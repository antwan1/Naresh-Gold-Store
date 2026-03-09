import { test, expect } from '../fixtures/auth.fixture'

test.describe('Orders API', () => {
  test('401 without auth', async ({ api }) => {
    expect((await api.get('/api/orders/')).status()).toBe(401)
    expect((await api.post('/api/orders/', { data: {} })).status()).toBe(401)
  })

  test('place order from cart', async ({ authedApi, api }) => {
    // Add a priced item to cart
    const product = (await (await api.get('/api/products/?metal_type=silver')).json()).results[0]
    await authedApi.post('/api/cart/', { data: { product: product.id, quantity: 1 } })

    const res = await authedApi.post('/api/orders/', {
      data: {
        shipping_address_line1: '123 Test Street',
        shipping_city: 'London',
        shipping_postcode: 'SW1A 1AA',
        payment_method: 'cash',
      },
    })
    expect(res.ok()).toBeTruthy()
    const order = await res.json()
    expect(order).toHaveProperty('id')
    expect(order.status).toBe('pending')
    expect(order.items.length).toBeGreaterThan(0)
  })

  test('cart is cleared after order is placed', async ({ authedApi, api }) => {
    const product = (await (await api.get('/api/products/?metal_type=gold')).json()).results[0]
    await authedApi.post('/api/cart/', { data: { product: product.id, quantity: 1 } })
    await authedApi.post('/api/orders/', {
      data: {
        shipping_address_line1: '123 Test Street',
        shipping_city: 'London',
        shipping_postcode: 'SW1A 1AA',
        payment_method: 'cash',
      },
    })
    const cart = await (await authedApi.get('/api/cart/')).json()
    expect(cart.item_count).toBe(0)
  })

  test('returns 400 if cart is empty', async ({ authedApi }) => {
    // Clear the cart first
    const cart = await (await authedApi.get('/api/cart/')).json()
    for (const item of cart.items) {
      await authedApi.delete(`/api/cart/${item.id}/`)
    }

    const res = await authedApi.post('/api/orders/', {
      data: {
        shipping_address_line1: '123 Test Street',
        shipping_city: 'London',
        shipping_postcode: 'SW1A 1AA',
        payment_method: 'cash',
      },
    })
    expect(res.status()).toBe(400)
  })

  test('get order history', async ({ authedApi }) => {
    const res = await authedApi.get('/api/orders/')
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(Array.isArray(data) || data.results).toBeTruthy()
  })
})
