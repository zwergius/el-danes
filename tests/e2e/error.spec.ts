import { expect, test } from '@playwright/test'

const errorRoutes = [
  { path: '/fr', expectedHeading: /not supported/i },
  { path: '/en/unknown-route', expectedHeading: /not found/i },
] as const

for (const { path, expectedHeading } of errorRoutes) {
  test(`${path} returns a meaningful not-found page`, async ({ page }) => {
    const response = await page.goto(path)

    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      expectedHeading
    )
  })
}
