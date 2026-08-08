import type { ProjectName, RouteContract } from './routes'

export interface AccessibilityException {
  rule: string
  routes: readonly RouteContract['path'][]
  projects: readonly ProjectName[]
  maxAffectedNodes: number
  rationale: string
  bugURL: `https://github.com/${string}`
}

export const accessibilityExceptions: readonly AccessibilityException[] = []

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
