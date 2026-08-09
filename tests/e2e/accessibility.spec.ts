import { test } from './fixtures/health'
import { routes, type RouteContract } from './routes'

function routeTestOptions(route: RouteContract) {
  return route.kind === 'wallet' ? { tag: '@desktop-only' } : {}
}

for (const route of routes) {
  test(
    `${route.path} has no unapproved serious or critical accessibility violations`,
    routeTestOptions(route),
    async ({ page, pageHealth }) => {
      await page.goto(route.path)

      await pageHealth.assertAccessible(route)
    }
  )
}
