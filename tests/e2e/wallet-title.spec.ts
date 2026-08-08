import AxeBuilder from '@axe-core/playwright'

import { expect, test } from './fixtures/health'
import { routes, type Locale, type ProjectName } from './routes'

const desktopUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/127.0.0.0 Safari/537.36'

test.use({ userAgent: desktopUserAgent })

const expectedTitles: Record<Locale, string> = {
  en: "Christian's contact card - El Danés Solutions",
  da: 'Christians kontaktkort - El Danés Solutions',
  es: 'Tarjeta de contacto de Christian - El Danés Solutions',
}

const walletRoutes = routes.filter((route) => route.kind === 'wallet')

for (const route of walletRoutes) {
  test(`${route.locale} wallet has a localized document title`, async ({
    page,
    pageHealth,
  }, testInfo) => {
    test.skip(!route.projects.includes(testInfo.project.name as ProjectName))

    const response = await page.goto(route.path)

    await pageHealth.assertLoaded(response, route)
    await expect(page).toHaveTitle(expectedTitles[route.locale])

    const axeResults = await new AxeBuilder({ page })
      .withRules(['document-title'])
      .analyze()
    const seriousOrCritical = axeResults.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? '')
    )

    expect(seriousOrCritical).toEqual([])
  })
}
