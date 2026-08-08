import { redirect, error } from '@sveltejs/kit'
import { baseLocale, locales } from '$i18n/i18n-util'
import { loadLocaleAsync } from '$i18n/i18n-util.async'
import { setLocale } from '$i18n/i18n-svelte'
import type { LayoutLoad } from './$types'
import type { Locales } from '$i18n/i18n-types'

export const prerender = true

export const load: LayoutLoad = async ({ params, url }) => {
  const { pathname } = url
  const lang = params.lang as Locales | undefined

  // DEV only - cloudflare redirects 🔥
  if (pathname === '/') {
    redirect(302, `/${baseLocale}`)
  }
  // Unmatched routes have no language parameter; preserve their original 404.
  if (lang === undefined) return

  // Unsupported language redirect to 404
  if (!locales.includes(lang)) {
    error(404, `${lang} language is not supported.`)
  }

  await loadLocaleAsync(lang)
  setLocale(lang)

  return
}
