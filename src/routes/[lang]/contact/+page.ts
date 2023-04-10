import { error } from '@sveltejs/kit'
import { PUBLIC_EMAIL, PUBLIC_PHONENO } from '$env/static/public'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, params }) => {
  const { lang } = params
  const email = PUBLIC_EMAIL
  const phoneNo = PUBLIC_PHONENO
  const res = await fetch('/code/contact.json')
  const code = await res.text()
  if (!res.ok) {
    throw error(404, `/${lang}/contact.json Not found`)
  }
  return {
    code,
    email,
    phoneNo,
  }
}
