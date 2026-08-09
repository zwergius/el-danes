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
  expectedTitle: string
  primaryLandmark: 'main'
  sourceExpected: boolean
  projects: readonly ProjectName[]
}

const desktopProjects = ['desktop-chromium', 'firefox'] as const
const contentProjects = projectNames

const localizedContent = {
  en: {
    home: 'Freelance Website & App Development.',
    cases: 'Keeping good company.',
    contact: 'Contact',
    wallet: "Christian's contact card",
  },
  da: {
    home: 'Design drevet website & app udvikling.',
    cases: 'Holder godt selskab.',
    contact: 'Kontakt',
    wallet: 'Christians kontaktkort',
  },
  es: {
    home: 'Desarrollo independiente de sitios web y aplicaciones.',
    cases: 'En buena compañia.',
    contact: 'Contacto',
    wallet: 'Tarjeta de contacto de Christian',
  },
} as const satisfies Record<Locale, Record<RouteKind, string>>

function expectedTitle(locale: Locale, kind: RouteKind): string {
  return `${localizedContent[locale][kind]} - El Danés Solutions`
}

export const routes: readonly RouteContract[] = locales.flatMap((locale) => [
  {
    path: `/${locale}`,
    locale,
    kind: 'home',
    expectedLanguage: locale,
    expectedTitle: expectedTitle(locale, 'home'),
    primaryLandmark: 'main',
    sourceExpected: true,
    projects: contentProjects,
  },
  {
    path: `/${locale}/cases`,
    locale,
    kind: 'cases',
    expectedLanguage: locale,
    expectedTitle: expectedTitle(locale, 'cases'),
    primaryLandmark: 'main',
    sourceExpected: true,
    projects: contentProjects,
  },
  {
    path: `/${locale}/contact`,
    locale,
    kind: 'contact',
    expectedLanguage: locale,
    expectedTitle: expectedTitle(locale, 'contact'),
    primaryLandmark: 'main',
    sourceExpected: true,
    projects: contentProjects,
  },
  {
    path: `/${locale}/contact/christian`,
    locale,
    kind: 'wallet',
    expectedLanguage: locale,
    expectedTitle: expectedTitle(locale, 'wallet'),
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
