import AxeBuilder from '@axe-core/playwright'
import {
  expect,
  test as base,
  type Page,
  type Response,
} from '@playwright/test'

import { accessibilityExceptionsFor } from '../accessibility-exceptions'
import type { RouteContract } from '../routes'

const cloudflareWebAnalyticsRumEndpoint =
  /(?:^|[^A-Za-z0-9.-])cloudflareinsights\.com\/cdn-cgi\/rum(?=$|[?#\s"'()[\]{},;:]|\.(?=$|[\s"'()[\]{},;:]))/

export function isCloudflareWebAnalyticsRumFailure(message: string): boolean {
  return cloudflareWebAnalyticsRumEndpoint.test(message)
}

function isCloudflareWebAnalyticsRumCorsCompanion(
  message: string,
  targetOrigin: string
): boolean {
  return (
    message ===
    `Origin ${targetOrigin} is not allowed by Access-Control-Allow-Origin. Status code: 404`
  )
}

interface PageHealth {
  // ESLint's base rule treats interface parameter names as runtime variables.
  // eslint-disable-next-line no-unused-vars
  assertLoaded(response: Response | null, route: RouteContract): Promise<void>
  // eslint-disable-next-line no-unused-vars
  assertAccessible(route: RouteContract): Promise<void>
}

interface HealthFixtures {
  pageHealth: PageHealth
}

function absoluteURLs(value: string): URL[] {
  return (value.match(/https?:\/\/[^\s'"\])]+/g) ?? []).flatMap((value) => {
    try {
      return [new URL(value)]
    } catch {
      return []
    }
  })
}

function isFirstPartyConsoleError(
  message: { text: string; url: string },
  targetOrigin: string
): boolean {
  const referencedURLs = absoluteURLs(message.text)
  if (referencedURLs.some((url) => url.origin !== targetOrigin)) return false

  if (!message.url) return true
  try {
    return new URL(message.url).origin === targetOrigin
  } catch {
    return true
  }
}

export const test = base.extend<HealthFixtures>({
  pageHealth: async ({ page }, use, testInfo) => {
    const pageErrors: Error[] = []
    const consoleErrors: { text: string; url: string }[] = []
    const failedRequests: { method: string; url: string }[] = []

    page.on('pageerror', (error) => pageErrors.push(error))
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push({
          text: message.text(),
          url: message.location().url,
        })
      }
    })
    page.on('requestfailed', (request) => {
      failedRequests.push({ method: request.method(), url: request.url() })
    })

    await use({
      async assertLoaded(response, route) {
        expect(response, `navigation response for ${route.path}`).not.toBeNull()
        expect(response?.ok(), `successful navigation to ${route.path}`).toBe(
          true
        )
        await expect(page.locator('html')).toHaveAttribute(
          'lang',
          route.expectedLanguage
        )
        await expect(page).toHaveTitle(route.expectedTitle)
        const primaryLandmark = page.locator(route.primaryLandmark)
        await expect(primaryLandmark).toHaveCount(1)
        await expect(primaryLandmark).toBeVisible()

        const currentLanguage = page.locator(
          'a.language-switch[aria-current="language"]'
        )
        if ((await currentLanguage.count()) === 0) {
          await page.locator('#mobile-navigation-toggle').click()
        }
        await expect(currentLanguage).toHaveCount(1)
        await expect(currentLanguage).toHaveAttribute(
          'href',
          new RegExp(`^/${route.locale}(?:/|$)`)
        )

        const targetOrigin = new URL(response!.url()).origin
        const firstPartyFailures = failedRequests.filter(
          (request) => new URL(request.url).origin === targetOrigin
        )
        const hasCloudflareRumPageError = pageErrors.some((error) =>
          isCloudflareWebAnalyticsRumFailure(error.message)
        )
        const actionablePageErrors = pageErrors.filter(
          (error) => !isCloudflareWebAnalyticsRumFailure(error.message)
        )
        const actionableConsoleErrors = consoleErrors.filter(
          (message) =>
            isFirstPartyConsoleError(message, targetOrigin) &&
            !isCloudflareWebAnalyticsRumFailure(message.text) &&
            !(
              hasCloudflareRumPageError &&
              isCloudflareWebAnalyticsRumCorsCompanion(
                message.text,
                targetOrigin
              )
            )
        )
        expect(actionablePageErrors, 'uncaught page exceptions').toEqual([])
        expect(
          actionableConsoleErrors,
          'first-party console.error messages'
        ).toEqual([])
        expect(firstPartyFailures, 'failed first-party requests').toEqual([])
      },

      async assertAccessible(route) {
        const axeResults = await new AxeBuilder({ page }).analyze()
        const seriousOrCritical = axeResults.violations.filter((violation) =>
          ['serious', 'critical'].includes(violation.impact ?? '')
        )
        const exceptions = accessibilityExceptionsFor(
          route.path,
          testInfo.project.name
        )
        const unexpected = seriousOrCritical.filter((violation) => {
          const exception = exceptions.find(
            (entry) => entry.rule === violation.id
          )
          return (
            !exception || violation.nodes.length > exception.maxAffectedNodes
          )
        })
        expect(
          unexpected,
          'unexpected serious or critical axe violations'
        ).toEqual([])

        for (const exception of exceptions) {
          const violation = seriousOrCritical.find(
            (violation) => violation.id === exception.rule
          )
          expect(
            violation,
            `approved ${exception.rule} exception must still affect ${route.path}`
          ).toBeDefined()
          expect(
            violation!.nodes.length,
            `${exception.rule} affected-node ceiling for ${route.path}`
          ).toBeLessThanOrEqual(exception.maxAffectedNodes)
        }
      },
    })
  },
})

export { expect } from '@playwright/test'
export type { Page }
