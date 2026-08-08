import { expect, test } from './fixtures/health'

const localeChoices = [
  { locale: 'da', label: 'DA', landmark: 'Holder godt selskab.' },
  { locale: 'es', label: 'SP', landmark: 'En buena compañia.' },
  { locale: 'en', label: 'EN', landmark: 'Keeping good company.' },
] as const

test('preserves the current subpage when switching between locales', async ({
  page,
}) => {
  await page.goto('/en/cases')

  for (const choice of localeChoices) {
    const languageLink = page.getByRole('link', {
      name: choice.label,
      exact: true,
    })
    if (!(await languageLink.isVisible())) {
      await page.getByRole('button', { name: 'menu' }).click()
    }

    await languageLink.click()

    await expect(page).toHaveURL(`/${choice.locale}/cases`)
    await expect(page.locator('html')).toHaveAttribute('lang', choice.locale)
    await expect(page.locator('footer .title')).toHaveText(choice.landmark)
    if (!(await page.locator('a.language-switch').first().isVisible())) {
      await page.getByRole('button', { name: 'menu' }).click()
    }
    await expect(
      page.locator('a.language-switch[aria-current="language"]')
    ).toHaveText(choice.label)
  }
})
