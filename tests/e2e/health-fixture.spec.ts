import { expect, test, type Page } from './fixtures/health'
import { routes } from './routes'

const englishHome = routes.find((route) => route.path === '/en')
if (!englishHome)
  throw new Error('English home route is missing from the manifest')

const loadControlledHome = async (page: Page) => {
  await page.route('**/en', async (route) => {
    await route.fulfill({
      body: `<!doctype html><html lang="${englishHome.expectedLanguage}"><head><meta charset="utf-8"><title>${englishHome.expectedTitle}</title></head><body><main>Fixture page</main><a class="language-switch" aria-current="language" href="${englishHome.path}">English</a></body></html>`,
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

test('ignores the target-less WebKit CORS companion to a Cloudflare RUM exception', async ({
  page,
  pageHealth,
}) => {
  const response = await loadControlledHome(page)
  const pageError = page.waitForEvent('pageerror')
  await page.evaluate(() => {
    window.console.error(
      `Origin ${window.location.origin} is not allowed by Access-Control-Allow-Origin. Status code: 404`
    )
    setTimeout(() => {
      throw new Error(
        'XMLHttpRequest cannot load https:/cloudflareinsights.com/cdn-cgi/rum due to access control checks.'
      )
    })
  })
  await pageError

  await pageHealth.assertLoaded(response, englishHome)
})

test('reports an unpaired target-less CORS console error', async ({
  page,
  pageHealth,
}) => {
  const response = await loadControlledHome(page)
  const firstPartyScript = new URL('/e2e-cors-error.js', page.url()).href
  await page.route(firstPartyScript, async (route) => {
    await route.fulfill({
      body: `console.error('Origin ${new URL(page.url()).origin} is not allowed by Access-Control-Allow-Origin. Status code: 404')`,
      contentType: 'application/javascript',
    })
  })
  await page.addScriptTag({ url: firstPartyScript })

  await expect(pageHealth.assertLoaded(response, englishHome)).rejects.toThrow(
    'first-party console.error messages'
  )
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
