import { config } from 'dotenv'
import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'

config()

const { EMAIL, PHONE_NO, PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

export default polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware({
      session: () => ({
        email: EMAIL,
        phoneNo: PHONE_NO,
      }),
    })
  )
  .listen(PORT, (err) => {
    if (err) console.log('error', err)
  })
