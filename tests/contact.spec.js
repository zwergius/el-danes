import { test, expect, devices } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('/en')
  if (devices === 'Mobile Chrome' || devices === 'Mobile Safar') {
    await page.getByTestId('showMenu').click()
    await page.waitForLoadState('networkidle')
    await page.getByTestId('contact').click()
    const contactPage = page.url()
    expect(contactPage).toContain('/en/contact')
    const emailElement = await page.$('[data-testid="email"]')
    const linkElement = await emailElement.$('a')

    const emailText = await linkElement.textContent()
    expect(emailText).not.toBeEmpty()
  }
  if (devices === 'firefox' || devices === 'webkit' || devices === 'chromium') {
    await page.getByTestId('contact').click()
    const contactPage = page.url()
    expect(contactPage).toContain('/en/contact')
    const emailElement = await page.$('[data-testid="email"]')
    const linkElement = await emailElement.$('a')

    const emailText = await linkElement.textContent()
    expect(emailText).not.toBeEmpty()
  }
})
