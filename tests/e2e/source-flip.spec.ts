import { expect, test, type Page } from './fixtures/health'

const sourceFlip = (page: Page) =>
  page.getByRole('switch', { name: 'Show code' })

async function exposeSourceFlip(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', { name: 'menu' }).click()
  }
  await expect(sourceFlip(page)).toHaveCount(1)
  await expect(sourceFlip(page)).toBeVisible()
}

for (const path of ['/en', '/en/cases', '/en/contact'] as const) {
  test(`exposes populated reversible source on ${path}`, async ({
    page,
    isMobile,
  }) => {
    await page.goto(path)
    await exposeSourceFlip(page, isMobile)

    await sourceFlip(page).click()
    await expect(sourceFlip(page)).toHaveAttribute('aria-checked', 'true')
    await expect(page.locator('main code')).not.toBeEmpty()

    await sourceFlip(page).click()
    await expect(sourceFlip(page)).not.toHaveAttribute('aria-checked', 'true')
    await expect(page.locator('main code')).toHaveCount(0)
  })
}

test('does not expose source on the wallet', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile-chromium') {
    await page.route('https://pay.google.com/**', (route) => route.abort())
    const handoff = page.waitForEvent('request', {
      predicate: (request) =>
        request.url().startsWith('https://pay.google.com/gp/v/save/'),
    })
    await page.goto('/en/contact/christian', { waitUntil: 'commit' })
    expect(new URL((await handoff).url()).protocol).toBe('https:')
    return
  }

  if (testInfo.project.name === 'webkit') {
    await page.route('**/el-danes.pkpass', (route) => route.abort())
    const handoff = page.waitForEvent('request', {
      predicate: (request) => request.url().endsWith('/el-danes.pkpass'),
    })
    await page.goto('/en/contact/christian', { waitUntil: 'commit' })
    expect(new URL((await handoff).url()).pathname).toBe('/el-danes.pkpass')
    return
  }

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      get: () => 'Mozilla/5.0 (X11; Linux x86_64)',
    })
  })
  await page.goto('/en/contact/christian')
  await expect(sourceFlip(page)).toHaveCount(0)
})
