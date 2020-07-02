import * as sapper from '@sapper/app'
import { startClient } from './i18n.js'

const language = window.location.pathname.split('/')[1]
startClient(language)

sapper.start({
  target: document.querySelector('#sapper'),
})
