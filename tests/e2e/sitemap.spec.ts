import { expect, test } from '@playwright/test'

import { routes } from './routes'

const publicOrigin = 'https://www.xn--eldans-fva.com'

function normalizedPublicURL(value: string): string {
  const url = new URL(value)
  url.pathname = url.pathname.replace(/\/$/, '')
  return url.href
}

test('sitemap contains exactly the localized public content routes', async ({
  page,
  request,
}) => {
  const response = await request.get('/sitemap.xml')

  expect(response.ok()).toBe(true)
  const body = await response.text()
  const parsed = await page.evaluate((xml) => {
    const document = new DOMParser().parseFromString(xml, 'application/xml')
    return {
      error: document.querySelector('parsererror')?.textContent ?? null,
      locations: Array.from(document.querySelectorAll('loc')).map(
        (location) => location.textContent ?? ''
      ),
    }
  }, body)
  expect(parsed.error).toBeNull()

  const actualURLs = parsed.locations.map(normalizedPublicURL).sort()
  const expectedURLs = routes
    .filter((route) => route.kind !== 'wallet')
    .map((route) => normalizedPublicURL(`${publicOrigin}${route.path}`))
    .sort()

  expect(actualURLs).toEqual(expectedURLs)
  expect(actualURLs.some((url) => url.includes('/contact/christian'))).toBe(
    false
  )
})
