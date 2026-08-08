import type { ProjectName, RouteContract } from './routes'

export interface AccessibilityException {
  rule: string
  routes: readonly RouteContract['path'][]
  projects: readonly ProjectName[]
  maxAffectedNodes: number
  rationale: string
  bugURL: `https://github.com/${string}`
}

const walletRoutes = [
  '/en/contact/christian',
  '/da/contact/christian',
  '/es/contact/christian',
] as const

export const accessibilityExceptions: readonly AccessibilityException[] = [
  {
    rule: 'document-title',
    routes: walletRoutes,
    projects: ['desktop-chromium', 'firefox'],
    maxAffectedNodes: 1,
    rationale: 'Measured missing wallet document title; scope may only shrink.',
    bugURL: 'https://github.com/zwergius/el-danes/issues/108',
  },
]

export function accessibilityExceptionsFor(
  route: RouteContract['path'],
  project: string
): readonly AccessibilityException[] {
  return accessibilityExceptions.filter(
    (entry) =>
      entry.routes.includes(route) &&
      entry.projects.includes(project as ProjectName)
  )
}
