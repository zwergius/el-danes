import { test, expect } from '@playwright/test'

test('shows the navigation up to cases and what links there are', async ({
  page,
}) => {
  await page.goto('/en')

  await page.getByTestId('cases').click()
  await page.waitForLoadState('networkidle')
  const contactPage = page.url()
  expect(contactPage).toContain('/en/cases')

  await page.click('[data-testid="linksJobs"]')
  const ulElement = await page.locator('[data-testid="linksJobs"]')
  const areLinksPresent = await ulElement.evaluate((element) => {
    const linkElements = element.querySelectorAll('a')
    return linkElements.length > 0
  })
  expect(areLinksPresent).toBeTruthy()
})
