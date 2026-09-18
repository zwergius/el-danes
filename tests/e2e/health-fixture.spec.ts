import { expect, test, type Page } from './fixtures/health'
import { routes } from './routes'

const englishHome = routes.find((route) => route.path === '/en')
if (!englishHome)
  throw new Error('English home route is missing from the manifest')

const loadControlledHome = async (page: Page) => {
  await page.route('**/en', async (route) => {
    await route.fulfill({
      body: '<!doctype html><html lang="en"><head><title>Fixture page</title></head><body><main>Fixture page</main></body></html>',
      contentType: 'text/html',
    })
  })

  return page.goto(englishHome.path)
}

test('ignores Cloudflare RUM console failures', async ({
  page,
  pageHealth,
}) => {
  const response = await loadControlledHome(page)
  await page.evaluate(() => {
    window.console.error(
      "Access to XMLHttpRequest at 'https://cloudflareinsights.com/cdn-cgi/rum' from origin 'https://preview.example' has been blocked by CORS policy."
    )
  })

  await pageHealth.assertLoaded(response, englishHome)
})

test('ignores Cloudflare RUM page exceptions', async ({ page, pageHealth }) => {
  const response = await loadControlledHome(page)
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
  const response = await loadControlledHome(page)
  const firstPartyScript = new URL('/e2e-console-error.js', page.url()).href
  await page.route(firstPartyScript, async (route) => {
    await route.fulfill({
      body: "console.error('Application failed to initialize')",
      contentType: 'application/javascript',
    })
  })
  await page.addScriptTag({ url: firstPartyScript })

  await expect(pageHealth.assertLoaded(response, englishHome)).rejects.toThrow(
    'first-party console.error messages'
  )
})

test('reports unrelated page exceptions', async ({ page, pageHealth }) => {
  const response = await loadControlledHome(page)
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
