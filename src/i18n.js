import { register, init, locale as $locale } from 'svelte-i18n'

const INIT_OPTIONS = {
  fallbackLocale: 'en',
  initialLocale: null,
  loadingDelay: 200,
  formats: {},
  warnOnMissingMessages: true,
}

export const supportedLanguages = ['en', 'es', 'da']
let currentLocale = null

// supportedLanguages.forEach((lang) => {
//   register(lang, () => import(`./assets/translations/${lang}.json`))
// })
register('en', () => import('./assets/translations/en.json'))
register('es', () => import('./assets/translations/es.json'))
register('da', () => import('./assets/translations/da.json'))

$locale.subscribe((value) => {
  if (value === null) return

  currentLocale = value

  // if running in the client, save the language preference in a cookie
  if (typeof window !== 'undefined') {
    // localStorage.setItem('locale', value)
  }
})

// initialize the i18n library in client
export function startClient(language) {
  init({
    ...INIT_OPTIONS,
    initialLocale: localStorage.getItem('locale') || language,
  })
}

// https://github.com/sveltejs/sapper/issues/78
const DOCUMENT_REGEX = /^([^.?#@]+)?([?#](.+)?)?$/
// initialize the i18n library in the server and returns its middleware
export function i18nMiddleware() {
  // initialLocale will be set by the middleware
  init(INIT_OPTIONS)

  return (req, res, next) => {
    let promise
    // get the initial locale only for a document request
    const isDocument = DOCUMENT_REGEX.test(req.originalUrl)
    if (!isDocument) {
      next()
      return
    }

    const urlLocale = req.path.split('/')[1]

    // language not in url
    if (supportedLanguages.indexOf(urlLocale) === -1) {
      if (req.headers['accept-language']) {
        const headerLang = req.headers['accept-language'].split(',')[0].trim()
        if (headerLang && headerLang.length > 1) {
          promise = $locale.set(headerLang)
          let language = headerLang.slice(0, 2)
          if (supportedLanguages.indexOf(language) === -1) language = 'en'
          res.writeHead(301, { Location: `/${language}` })
          res.end(`Redirect to ${language}`)
          if (promise) return promise.then(() => next())
        }
      } else {
        res.writeHead(301, { Location: `/${INIT_OPTIONS.fallbackLocale}` })
        res.end(`Redirect to ${INIT_OPTIONS.fallbackLocale}`)
      }
    } else if (currentLocale !== urlLocale) {
      promise = $locale.set(urlLocale)
      if (promise) return promise.then(() => next())
    }

    next()
  }
}
