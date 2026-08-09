import { expect, test, type Page } from './fixtures/health'

const localeChoices = [
  { locale: 'da', label: 'DA' },
  { locale: 'es', label: 'SP' },
  { locale: 'en', label: 'EN' },
] as const

async function exposeLanguageNavigation(page: Page, isMobile: boolean) {
  if (isMobile) {
    await expect(page.locator('#mobile-navigation-toggle')).toBeVisible()
    const menuButton = page.getByRole('button', { name: 'menu' })
    if (await menuButton.isVisible()) await menuButton.click()
  }
  await expect(page.locator('a.language-switch').first()).toBeVisible()
}

test('preserves the current subpage when switching between locales', async ({
  page,
  isMobile,
}) => {
  const subpages = ['cases', 'contact']
  if (!isMobile) {
    subpages.push('contact/christian')
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        configurable: true,
        get: () => 'Mozilla/5.0 (X11; Linux x86_64)',
      })
    })
  }

  for (const subpage of subpages) {
    await page.goto(`/en/${subpage}`)

    for (const choice of localeChoices) {
      await exposeLanguageNavigation(page, isMobile)
      const languageLink = page.getByRole('link', {
        name: choice.label,
        exact: true,
      })
      await expect(languageLink).toBeVisible()

      await languageLink.click()

      await expect(page).toHaveURL(`/${choice.locale}/${subpage}`)
      await expect(page.locator('html')).toHaveAttribute('lang', choice.locale)
      await exposeLanguageNavigation(page, isMobile)
      await expect(
        page.locator('a.language-switch[aria-current="language"]')
      ).toHaveText(choice.label)
    }
  }
})
