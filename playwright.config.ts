import { defineConfig, devices } from '@playwright/test'

const LOCAL_BASE_URL = 'http://127.0.0.1:3001'
const previewURL = process.env.PLAYWRIGHT_BASE_URL

function immutablePreviewURL(value: string): string {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error('PLAYWRIGHT_BASE_URL must be a valid URL')
  }

  const immutableHostname = /^[0-9a-f]+\.el-danes\.pages\.dev$/
  if (
    url.protocol !== 'https:' ||
    !immutableHostname.test(url.hostname) ||
    url.username ||
    url.password ||
    url.port ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'PLAYWRIGHT_BASE_URL must be an immutable HTTPS deployment root under el-danes.pages.dev'
    )
  }

  return url.origin
}

const baseURL = previewURL ? immutablePreviewURL(previewURL) : LOCAL_BASE_URL

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'webkit',
      use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: previewURL
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --host 127.0.0.1',
        url: `${LOCAL_BASE_URL}/en`,
        reuseExistingServer: !process.env.CI,
        env: {
          PUBLIC_EMAIL: 'e2e@example.invalid',
          PUBLIC_PHONENO: '+120****0123',
        },
      },
})
