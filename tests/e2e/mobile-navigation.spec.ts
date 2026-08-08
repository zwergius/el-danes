import AxeBuilder from '@axe-core/playwright'

import { expect, test, type Page } from './fixtures/health'
import { routes } from './routes'

const spanishHome = routes.find((route) => route.path === '/es')
if (!spanishHome)
  throw new Error('Spanish home route is missing from the manifest')

async function seriousOrCriticalToggleViolations(page: Page) {
  const axeResults = await new AxeBuilder({ page })
    .include('#mobile-navigation-toggle')
    .analyze()
  return axeResults.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? '')
  )
}

test.describe('mobile navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(spanishHome.path)
  })

  test('exposes state and supports pointer and keyboard activation', async ({
    page,
    isMobile,
  }) => {
    const toggle = page.locator('#mobile-navigation-toggle')

    if (!isMobile) {
      await expect(toggle).toBeHidden()
      await expect(page.getByRole('navigation')).toBeVisible()
      return
    }

    await expect(toggle).toHaveAccessibleName('menu')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(
      await seriousOrCriticalToggleViolations(page),
      'serious or critical collapsed toggle violations'
    ).toEqual([])

    await toggle.click()
    await expect(toggle).toHaveAccessibleName('back')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('navigation')).toBeVisible()

    expect(
      await seriousOrCriticalToggleViolations(page),
      'serious or critical expanded toggle violations'
    ).toEqual([])

    await page.getByRole('button', { name: 'back' }).click()
    await expect(toggle).toHaveAccessibleName('menu')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await toggle.focus()
    await page.keyboard.press('Enter')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await page.keyboard.press('Space')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  test('navigates through a localized menu link', async ({
    page,
    isMobile,
  }) => {
    const toggle = page.getByRole('button', { name: 'menu' })

    if (isMobile) await toggle.click()
    await page.getByRole('link', { name: 'Contacto' }).click()

    await expect(page).toHaveURL(/\/es\/contact\/?$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  })
})
