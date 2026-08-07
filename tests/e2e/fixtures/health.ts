import AxeBuilder from '@axe-core/playwright'
import {
  expect,
  test as base,
  type Page,
  type Response,
} from '@playwright/test'

import { accessibilityExceptionsFor } from '../accessibility-exceptions'
import type { RouteContract } from '../routes'

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

export const test = base.extend<HealthFixtures>({
  pageHealth: async ({ page }, use, testInfo) => {
    const pageErrors: Error[] = []
    const consoleErrors: { text: string; url: string }[] = []
    const failedRequests: string[] = []

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
      failedRequests.push(`${request.method()} ${request.url()}`)
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
        await expect(page).toHaveTitle(/\S+/)
        await expect(page.locator(route.primaryLandmark)).toBeVisible()

        const targetOrigin = new URL(response!.url()).origin
        const firstPartyFailures = failedRequests.filter((request) =>
          request.includes(targetOrigin)
        )
        const actionableConsoleErrors = consoleErrors.filter(
          (message) => !message.url || message.url.startsWith(targetOrigin)
        )
        expect(pageErrors, 'uncaught page exceptions').toEqual([])
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
      },
    })
  },
})

export { expect } from '@playwright/test'
export type { Page }
