import { expect, test, type Page, type Request } from '@playwright/test'

const socialDestinations = {
  instagram: 'https://www.instagram.com/el.danes/',
  github: 'https://github.com/zwergius',
  linkedin: 'https://www.linkedin.com/in/christian-zwergius',
  behance: 'https://www.behance.net/christizwergiu',
} as const

function waitForAttempt(
  page: Page,
  // ESLint's base rule treats type-only parameter names as runtime variables.
  // eslint-disable-next-line no-unused-vars
  predicate: (request: Request) => boolean
) {
  return page.waitForEvent('request', { predicate })
}

test('validates contact and social destinations without visiting them', async ({
  page,
}) => {
  await page.goto('/en/contact')

  const phoneLink = page.locator('#telephone-link')
  const displayedPhone = (await phoneLink.textContent())?.trim()
  expect(displayedPhone).toBeTruthy()
  await expect(phoneLink).toHaveAttribute('href', `tel:${displayedPhone}`)
  await expect(phoneLink).toHaveAttribute('target', '_self')

  const emailLink = page.getByRole('link', { name: /@/ })
  const displayedEmail = (await emailLink.textContent())?.trim()
  expect(displayedEmail).toBeTruthy()
  const mailto = new URL((await emailLink.getAttribute('href'))!)
  expect(mailto.protocol).toBe('mailto:')
  expect(mailto.pathname).toBe(displayedEmail)
  expect(mailto.searchParams.get('subject')).toBeTruthy()
  await expect(emailLink).toHaveAttribute('target', '_self')

  for (const [name, destination] of Object.entries(socialDestinations)) {
    const link = page.getByRole('link', { name, exact: true })
    await expect(link).toHaveAttribute('href', destination)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /\bnoopener\b/)
    expect(new URL(destination).protocol).toBe('https:')
  }
})

test('validates wallet choices or captures the platform handoff', async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === 'mobile-chromium') {
    await page.route('https://pay.google.com/**', (route) => route.abort())
    const handoff = waitForAttempt(page, (request) =>
      request.url().startsWith('https://pay.google.com/gp/v/save/')
    )
    await page.goto('/en/contact/christian')
    expect(new URL((await handoff).url()).protocol).toBe('https:')
    return
  }

  if (testInfo.project.name === 'webkit') {
    await page.route('**/el-danes.pkpass', (route) => route.abort())
    const handoff = waitForAttempt(page, (request) =>
      request.url().endsWith('/el-danes.pkpass')
    )
    await page.goto('/en/contact/christian')
    const pkpass = new URL((await handoff).url())
    expect(pkpass.pathname).toBe('/el-danes.pkpass')
    expect(pkpass.origin).toBe(new URL(page.url()).origin)
    return
  }

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      get: () => 'Mozilla/5.0 (X11; Linux x86_64)',
    })
  })
  await page.goto('/en/contact/christian')

  const apple = page.getByRole('link', { name: /wallet for ios/i })
  const google = page.getByRole('link', { name: /wallet for android/i })
  const appleURL = new URL((await apple.getAttribute('href'))!, page.url())
  const googleURL = new URL((await google.getAttribute('href'))!)

  expect(appleURL.origin).toBe(new URL(page.url()).origin)
  expect(appleURL.pathname).toBe('/el-danes.pkpass')
  expect(googleURL.protocol).toBe('https:')
  expect(googleURL.hostname).toBe('pay.google.com')
  await expect(google).toHaveAttribute('target', '_blank')
  await expect(google).toHaveAttribute('rel', /\bnoopener\b/)
})
