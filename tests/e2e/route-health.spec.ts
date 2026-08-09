import { expect, test } from './fixtures/health'
import { routes, type RouteContract } from './routes'

function routeTestOptions(route: RouteContract) {
  return route.kind === 'wallet' ? { tag: '@desktop-only' } : {}
}

for (const route of routes) {
  test(
    `${route.path} satisfies its localized page-health contract`,
    routeTestOptions(route),
    async ({ page, pageHealth }) => {
      const response = await page.goto(route.path)

      await pageHealth.assertLoaded(response, route)
    }
  )
}

test('/ redirects exactly once to /en', async ({ page }) => {
  const navigatedPaths: string[] = []
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame() && frame.url().startsWith('http')) {
      navigatedPaths.push(new URL(frame.url()).pathname)
    }
  })
  const response = await page.goto('/')

  expect(response, 'navigation response for /').not.toBeNull()
  expect(response?.ok(), 'successful navigation after redirect').toBe(true)
  expect(new URL(page.url()).pathname).toBe('/en')

  const redirects = []
  let request = response?.request().redirectedFrom()
  while (request) {
    redirects.push(request)
    request = request.redirectedFrom()
  }

  if (redirects.length > 0) {
    expect(redirects).toHaveLength(1)
    expect(new URL(redirects[0].url()).pathname).toBe('/')
    expect(navigatedPaths).toEqual(['/en'])
  } else {
    expect(navigatedPaths).toEqual(['/', '/en'])
  }
})
