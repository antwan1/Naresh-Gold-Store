import { test as base, APIRequestContext } from '@playwright/test'

export const TEST_CUSTOMER = {
  email: 'testcustomer@example.com',
  password: 'TestPassword123!',
}

export const TEST_ADMIN = {
  email: 'admin@nareshjewellers.co.uk',
  password: 'AdminPassword123!',
}

type AuthFixtures = {
  api: APIRequestContext
  authedApi: APIRequestContext
}

export const test = base.extend<AuthFixtures>({
  api: async ({ playwright }, use) => {
    const ctx = await playwright.request.newContext({
      baseURL: 'http://localhost:8000',
    })
    await use(ctx)
    await ctx.dispose()
  },

  authedApi: async ({ playwright }, use) => {
    const tmp = await playwright.request.newContext({ baseURL: 'http://localhost:8000' })
    const res = await tmp.post('/api/auth/login/', { data: TEST_CUSTOMER })
    const { access } = await res.json()
    await tmp.dispose()

    const ctx = await playwright.request.newContext({
      baseURL: 'http://localhost:8000',
      extraHTTPHeaders: { Authorization: `Bearer ${access}` },
    })
    await use(ctx)
    await ctx.dispose()
  },
})

export { expect } from '@playwright/test'
