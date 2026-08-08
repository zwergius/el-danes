import AxeBuilder from '@axe-core/playwright'

import { expect, test } from './fixtures/health'
import { routes } from './routes'

const casesRoute = routes.find((route) => route.path === '/en/cases')
if (!casesRoute)
  throw new Error('English cases route is missing from the manifest')

async function openCases(page: import('@playwright/test').Page) {
  await page.goto(casesRoute.path)
  await page.evaluate(() => document.fonts.ready)
  const linkedCase = page
    .locator('[data-case]')
    .filter({ has: page.locator('a') })
    .first()
  await expect(linkedCase).toBeVisible()
  return linkedCase
}

test('reveals case details with pointer and keyboard without nested controls', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')

  const linkedCase = await openCases(page)
  const caseLink = linkedCase.getByRole('link')
  const detailsButton = linkedCase.getByRole('button')
  const details = linkedCase.locator('[data-case-details]')
  const nextCase = linkedCase.locator('xpath=following-sibling::*[1]')

  await expect(details).toBeHidden()
  await caseLink.hover()
  await expect(details).toBeVisible()
  await page.mouse.move(0, 0)
  await expect(details).toBeHidden()
  await expect
    .poll(() =>
      caseLink.evaluate((element) => getComputedStyle(element, '::after').width)
    )
    .toBe('0px')

  const nextCaseTop = await nextCase.evaluate(
    (element) => element.getBoundingClientRect().top + window.scrollY
  )

  await caseLink.hover()
  await expect(details).toBeVisible()
  await expect(details).toHaveCSS('position', 'absolute')
  expect(
    await details.evaluate((element) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas 2D context is unavailable')

      context.fillStyle = getComputedStyle(element).backgroundColor
      context.fillRect(0, 0, 1, 1)
      return context.getImageData(0, 0, 1, 1).data[3]
    })
  ).toBe(204)
  await expect
    .poll(() =>
      caseLink.evaluate((element) => getComputedStyle(element, '::after').width)
    )
    .not.toBe('0px')
  expect(
    await nextCase.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY
    )
  ).toBe(nextCaseTop)

  await page.mouse.move(0, 0)
  await expect(details).toBeHidden()
  await caseLink.focus()
  await expect(details).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(detailsButton).toBeFocused()
  await expect(details).toBeHidden()
  await page.keyboard.press('Enter')
  await expect(detailsButton).toHaveAttribute('aria-expanded', 'true')
  await expect(details).toBeVisible()

  const href = await caseLink.getAttribute('href')
  expect(href).toBeTruthy()
  expect(new URL(href!).protocol).toBe('https:')
  await expect(caseLink).toHaveAttribute('target', '_blank')
  await expect(caseLink).toHaveAttribute('rel', /\bnoopener\b/)

  await expect(linkedCase.locator('button a, a button')).toHaveCount(0)

  const axeResults = await new AxeBuilder({ page })
    .include('[data-case]')
    .analyze()
  const seriousOrCritical = axeResults.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? '')
  )
  expect(seriousOrCritical).toEqual([])
})

test('reveals case details by touch on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium')

  const linkedCase = await openCases(page)
  const detailsButton = linkedCase.getByRole('button')
  const details = linkedCase.locator('[data-case-details]')

  await expect(details).toBeHidden()
  await detailsButton.tap()
  await expect(detailsButton).toHaveAttribute('aria-expanded', 'true')
  await expect(details).toBeVisible()
})
