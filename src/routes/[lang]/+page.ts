import { error } from '@sveltejs/kit'
import { PUBLIC_EMAIL } from '$env/static/public'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, url }) => {
  const res = await fetch(`/code/home.json`)
  const email = PUBLIC_EMAIL
  if (!res.ok) {
    throw error(500, `Could not load code for ${url.pathname}`)
  }
  const code = await res.text()
  return { code, email }
}
