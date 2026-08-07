export const locales = ['en', 'da', 'es'] as const
export type Locale = (typeof locales)[number]

export const projectNames = [
  'desktop-chromium',
  'mobile-chromium',
  'firefox',
  'webkit',
] as const
export type ProjectName = (typeof projectNames)[number]
export type RouteKind = 'home' | 'cases' | 'contact' | 'wallet'

export interface RouteContract {
  path: `/${Locale}` | `/${Locale}/${string}`
  locale: Locale
  kind: RouteKind
  expectedLanguage: Locale
  primaryLandmark: 'main'
  sourceExpected: boolean
  projects: readonly ProjectName[]
}

const desktopProjects = ['desktop-chromium', 'firefox'] as const
const contentProjects = projectNames

export const routes: readonly RouteContract[] = locales.flatMap((locale) => [
  {
    path: `/${locale}`,
    locale,
    kind: 'home',
    expectedLanguage: locale,
    primaryLandmark: 'main',
    sourceExpected: true,
    projects: contentProjects,
  },
  {
    path: `/${locale}/cases`,
    locale,
    kind: 'cases',
    expectedLanguage: locale,
    primaryLandmark: 'main',
    sourceExpected: true,
    projects: contentProjects,
  },
  {
    path: `/${locale}/contact`,
    locale,
    kind: 'contact',
    expectedLanguage: locale,
    primaryLandmark: 'main',
    sourceExpected: true,
    projects: contentProjects,
  },
  {
    path: `/${locale}/contact/christian`,
    locale,
    kind: 'wallet',
    expectedLanguage: locale,
    primaryLandmark: 'main',
    sourceExpected: false,
    projects: desktopProjects,
  },
])

if (routes.length !== 12) {
  throw new Error(
    `Expected 12 localized route contracts, received ${routes.length}`
  )
}
