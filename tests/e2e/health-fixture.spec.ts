import { expect, test } from './fixtures/health'
import { routes } from './routes'

const englishHome = routes.find((route) => route.path === '/en')
if (!englishHome)
  throw new Error('English home route is missing from the manifest')

test('ignores Cloudflare RUM console failures', async ({
  page,
  pageHealth,
}) => {
  const response = await page.goto(englishHome.path)
  await page.evaluate(() => {
    window.console.error(
      "Access to XMLHttpRequest at 'https://cloudflareinsights.com/cdn-cgi/rum' from origin 'https://preview.example' has been blocked by CORS policy."
    )
  })

  await pageHealth.assertLoaded(response, englishHome)
})

test('ignores Cloudflare RUM page exceptions', async ({ page, pageHealth }) => {
  const response = await page.goto(englishHome.path)
  const pageError = page.waitForEvent('pageerror')
  await page.evaluate(() => {
    setTimeout(() => {
      throw new Error(
        'XMLHttpRequest cannot load https://cloudflareinsights.com/cdn-cgi/rum due to access control checks.'
      )
    })
  })
  await pageError

  await pageHealth.assertLoaded(response, englishHome)
})

test('reports unrelated first-party console errors', async ({
  page,
  pageHealth,
}) => {
  const response = await page.goto(englishHome.path)
  await page.evaluate(() => {
    window.console.error('Application failed to initialize')
  })

  await expect(pageHealth.assertLoaded(response, englishHome)).rejects.toThrow(
    'first-party console.error messages'
  )
})

test('reports unrelated page exceptions', async ({ page, pageHealth }) => {
  const response = await page.goto(englishHome.path)
  const pageError = page.waitForEvent('pageerror')
  await page.evaluate(() => {
    setTimeout(() => {
      throw new Error('Application failed to initialize')
    })
  })
  await pageError

  await expect(pageHealth.assertLoaded(response, englishHome)).rejects.toThrow(
    'uncaught page exceptions'
  )
})
