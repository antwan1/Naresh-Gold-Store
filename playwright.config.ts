import { defineConfig, devices } from '@playwright/test'

const isApiOnly = process.env.PLAYWRIGHT_PROJECT === 'api'

export default defineConfig({
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  projects: [
    // API tests: no browser, fast, run first
    {
      name: 'api',
      testDir: './e2e/api',
      use: { baseURL: 'http://localhost:8000' },
    },

    // UI E2E tests: run after API tests pass
    {
      name: 'chromium',
      testDir: './e2e/ui',
      dependencies: ['api'],
      use: {
        baseURL: 'http://localhost:5173',
        ...devices['Desktop Chrome'],
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'mobile-chrome',
      testDir: './e2e/ui',
      dependencies: ['api'],
      use: {
        baseURL: 'http://localhost:5173',
        ...devices['Pixel 5'],
      },
    },
  ],

  webServer: isApiOnly
    ? [
        {
          command: 'py -3 manage.py runserver 8000',
          cwd: './backend',
          port: 8000,
          reuseExistingServer: true,
        },
      ]
    : [
        {
          command: 'py -3 manage.py runserver 8000',
          cwd: './backend',
          port: 8000,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: 'npm run dev',
          cwd: './frontend',
          port: 5173,
          reuseExistingServer: !process.env.CI,
        },
      ],
})
