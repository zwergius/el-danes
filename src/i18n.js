import {
  register,
  init,
  getLocaleFromNavigator,
  locale as $locale,
} from 'svelte-i18n'

const INIT_OPTIONS = {
  fallbackLocale: 'en',
  initialLocale: null,
  loadingDelay: 200,
  formats: {},
  warnOnMissingMessages: true,
}

let currentLocale = null

register('en', () => import('./assets/translations/en.json'))
register('es', () => import('./assets/translations/es.json'))
register('da', () => import('./assets/translations/da.json'))

$locale.subscribe((value) => {
  if (value == null) return

  currentLocale = value

  // if running in the client, save the language preference in a cookie
  if (typeof window !== 'undefined') {
    // setCookie('locale', value)
  }
})

// initialize the i18n library in client
export function startClient() {
  console.log('!!!startClient', getLocaleFromNavigator())
  init({
    ...INIT_OPTIONS,
    //initialLocale: getCookie('locale') || getLocaleFromNavigator(),
    initialLocale: getLocaleFromNavigator(),
  })
}

const DOCUMENT_REGEX = /^([^.?#@]+)?([?#](.+)?)?$/
// initialize the i18n library in the server and returns its middleware
export function i18nMiddleware() {
  // initialLocale will be set by the middleware
  init(INIT_OPTIONS)

  return (req, res, next) => {
    console.log('hello i18nMiddleware req: ', req, ' res: ', res)
    //   console.log('locale: ', locale)
    //   const isDocument = DOCUMENT_REGEX.test(req.originalUrl)
    //   // get the initial locale only for a document request
    //   if (!isDocument) {
    //     next()
    //     return
    //   }

    //   // let locale = getCookie('locale', req.headers.cookie);

    //   // no cookie, let's get the first accepted language
    //   if (locale == null) {
    //     const headerLang = req.headers['accept-language'].split(',')[0].trim()
    //     if (headerLang.length > 1) {
    //       locale = headerLang
    //     }
    //   }

    //   if (locale != null && locale !== currentLocale) {
    //     $locale.set(locale)
    //   }

    next()
  }
}
