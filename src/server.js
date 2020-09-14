import { config } from 'dotenv'
import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'

import { i18nMiddleware } from './i18n.js'

config()

const { EMAIL, PHONE_NO, PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

export default polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    i18nMiddleware(),
    sapper.middleware({
      session: (_, res) => ({
        email: EMAIL,
        phoneNo: PHONE_NO,
        language: res.language,
      }),
    })
  )
  .listen(PORT, (err) => {
    if (err) console.log('error', err)
  })
