import { expect, test, type Page } from './fixtures/health'

async function exposeNavigation(page: Page) {
  const navigation = page.getByRole('navigation')
  if (!(await navigation.isVisible())) {
    await page.getByRole('button', { name: 'menu' }).click()
  }
  await expect(navigation).toBeVisible()
  return navigation
}

test('supports the primary navigation journeys', async ({ page, isMobile }) => {
  await page.goto('/en')

  if (isMobile) {
    await expect(page.getByRole('button', { name: 'menu' })).toBeVisible()
    await expect(page.getByRole('navigation')).toBeHidden()
  } else {
    await expect(page.locator('#mobile-navigation-toggle')).toBeHidden()
    await expect(page.getByRole('navigation')).toBeVisible()
  }

  await page.getByRole('link', { name: 'Cases Worked' }).click()
  await expect(page).toHaveURL(/\/en\/cases\/?$/)

  await page.getByRole('link', { name: /El Danés logo/ }).click()
  await expect(page).toHaveURL(/\/en\/?$/)

  const navigation = await exposeNavigation(page)
  await navigation.getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/\/en\/contact\/?$/)
})
