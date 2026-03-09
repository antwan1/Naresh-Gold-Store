import { test, expect, TEST_CUSTOMER } from '../fixtures/auth.fixture'

test.describe('Auth API', () => {
  test('register — creates account and returns tokens', async ({ api }) => {
    const res = await api.post('/api/auth/register/', {
      data: {
        email: `user_${Date.now()}@example.com`,
        password: 'SecurePass123!',
        first_name: 'Test',
        last_name: 'User',
        phone: '07700900000',
      },
    })
    expect(res.status()).toBe(201)
    const data = await res.json()
    expect(data).toHaveProperty('access')
    expect(data).toHaveProperty('refresh')
    expect(data.user.email).toBeTruthy()
  })

  test('register — rejects duplicate email', async ({ api }) => {
    const res = await api.post('/api/auth/register/', {
      data: {
        email: TEST_CUSTOMER.email,
        password: 'SecurePass123!',
        first_name: 'Duplicate',
        last_name: 'User',
      },
    })
    expect(res.status()).toBe(400)
  })

  test('login — returns JWT tokens', async ({ api }) => {
    const res = await api.post('/api/auth/login/', { data: TEST_CUSTOMER })
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.access).toBeTruthy()
    expect(data.refresh).toBeTruthy()
  })

  test('login — rejects wrong password', async ({ api }) => {
    const res = await api.post('/api/auth/login/', {
      data: { email: TEST_CUSTOMER.email, password: 'wrongpassword' },
    })
    expect(res.status()).toBe(401)
  })

  test('profile — 401 without token', async ({ api }) => {
    expect((await api.get('/api/auth/profile/')).status()).toBe(401)
  })

  test('profile — returns user data with token', async ({ authedApi }) => {
    const res = await authedApi.get('/api/auth/profile/')
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.email).toBe(TEST_CUSTOMER.email)
  })
})
