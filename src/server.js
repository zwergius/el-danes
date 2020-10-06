import { config } from 'dotenv'
import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'

config()

const { EMAIL, PHONE_NO, PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const supportedLanguages = ['da', 'en', 'es']
const fallbackLanguage = 'en'
const DOCUMENT_REGEX = /^([^.?#@]+)?([?#](.+)?)?$/

function localeRedirectMiddleware() {
  return (req, res, next) => {
    const isDocument = DOCUMENT_REGEX.test(req.originalUrl)
    if (!isDocument) {
      next()
      return
    }

    const urlLocale = req.path.split('/')[1]
    // language not in url
    if (supportedLanguages.indexOf(urlLocale) === -1) {
      let language = fallbackLanguage

      if (req.headers['accept-language']) {
        const headerLang = req.headers['accept-language']
          .split(',')[0]
          .trim()
          .slice(0, 2)

        if (headerLang && headerLang.length > 1) {
          if (supportedLanguages.indexOf(headerLang) !== -1)
            language = headerLang
        }
      }
      res.language = language
    }

    next()
  }
}

export default polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    localeRedirectMiddleware(),
    sapper.middleware({
      session: (req, res) => ({
        email: EMAIL,
        phoneNo: PHONE_NO,
        language: res.language,
      }),
    })
  )
  .listen(PORT, (err) => {
    if (err) console.log('error', err)
  })
