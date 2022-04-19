import type { RequestEvent } from '@sveltejs/kit'
import { detectLocale } from '$i18n/i18n-util'
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors'
const { VITE_EMAIL, VITE_PHONE_NO } = import.meta.env

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event: RequestEvent) {
  // detect the preferred language the user has configured in his browser
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
  const headers = getHeaders(event)
  const acceptLanguageDetector = initAcceptLanguageHeaderDetector({ headers })
  const locale = detectLocale(acceptLanguageDetector)

  return {
    email: VITE_EMAIL,
    locale,
    phoneNo: VITE_PHONE_NO,
  }
}

// /** @type {import('@sveltejs/kit').ExternalFetch} */
// export function externalFetch(request: Request) {
//   if (request.url.startsWith('https://raw.githubusercontent.com')) {
//     request.headers.set('User-Agent', 'zwergius')
//   }
//   return fetch(request)
// }

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event)

  // read language slug
  const [, lang] = event.url.pathname.split('/')

  // replace html lang attribute with correct language
  const body = await response.text();
  return new Response(body.replace('<html lang="en">', `<html lang="${lang}">`), response)
}

function getHeaders(event: RequestEvent) {
  const headers: Record<string, string> = {}
  event.request.headers.forEach((value, key) => headers[key] = value)

  return headers
}
