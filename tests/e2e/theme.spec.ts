import { expect, test, type Page } from './fixtures/health'

const themeControl = (page: Page, theme: 'dark' | 'light') =>
  page.getByRole('radio', { name: `Use ${theme} theme` })

async function exposeThemeControls(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', { name: 'menu' }).click()
  }
  await expect(themeControl(page, 'dark')).toBeVisible()
}

async function expectEffectiveTheme(page: Page, theme: 'dark' | 'light') {
  await expect(page.locator('html')).toHaveCSS('--color-mode', theme)
  await expect(themeControl(page, theme)).toHaveAttribute(
    'aria-checked',
    'true'
  )
}

test('uses the initial system theme in a clean context', async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/en')
  await exposeThemeControls(page, isMobile)
  await expectEffectiveTheme(page, 'dark')
})

test('persists the selected and effective theme across navigation and reload', async ({
  page,
  isMobile,
}) => {
  await page.goto('/en')
  await exposeThemeControls(page, isMobile)

  await themeControl(page, 'light').click()
  await expectEffectiveTheme(page, 'light')
  await expect(themeControl(page, 'dark')).not.toHaveAttribute(
    'aria-checked',
    'true'
  )

  await page.goto('/en/contact')
  await exposeThemeControls(page, isMobile)
  await expectEffectiveTheme(page, 'light')

  await themeControl(page, 'dark').click()
  await expectEffectiveTheme(page, 'dark')
  await page.reload()
  await exposeThemeControls(page, isMobile)
  await expectEffectiveTheme(page, 'dark')
})
