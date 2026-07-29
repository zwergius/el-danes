import { expect, test } from './fixtures/health'
import { routes } from './routes'

const englishHome = routes.find((route) => route.path === '/en')
if (!englishHome)
  throw new Error('English home route is missing from the manifest')

test('loads the public site through the configured target', async ({
  page,
  pageHealth,
}) => {
  const response = await page.goto(englishHome.path)
  await pageHealth.assertLoaded(response, englishHome)
  await expect(page.locator('body')).not.toBeEmpty()
})
