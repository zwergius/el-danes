import AxeBuilder from '@axe-core/playwright'

import { expect, test } from './fixtures/health'
import { routes } from './routes'

const casesPath = routes.find((route) => route.path === '/en/cases')?.path
if (!casesPath)
  throw new Error('English cases route is missing from the manifest')

async function openCases(page: import('@playwright/test').Page) {
  await page.goto(casesPath)
  await page.evaluate(() => document.fonts.ready)
  const linkedCase = page
    .locator('[data-case]')
    .filter({ has: page.locator('a') })
    .first()
  await expect(linkedCase).toBeVisible()
  return linkedCase
}

test('renders deployed cases with accessible details and link contracts', async ({
  page,
  isMobile,
}) => {
  const linkedCase = await openCases(page)
  const caseLink = linkedCase.getByRole('link')
  const detailsButton = linkedCase.getByRole('button')
  const details = linkedCase.locator('[data-case-details]')
  const nextCase = linkedCase.locator('xpath=following-sibling::*[1]')

  const cases = page.locator('[data-case]')
  expect(await cases.count()).toBeGreaterThan(0)
  for (const link of await cases.getByRole('link').all()) {
    const href = await link.getAttribute('href')
    expect(href).toBeTruthy()
    expect(new URL(href!).protocol).toBe('https:')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /\bnoopener\b/)
  }

  await expect(linkedCase.locator('button a, a button')).toHaveCount(0)

  if (isMobile) {
    await expect(details).toBeHidden()
    await detailsButton.tap()
    await expect(detailsButton).toHaveAttribute('aria-expanded', 'true')
    await expect(details).toBeVisible()
    return
  }

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

  const axeResults = await new AxeBuilder({ page })
    .include('[data-case]')
    .analyze()
  const seriousOrCritical = axeResults.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? '')
  )
  expect(seriousOrCritical).toEqual([])
})
