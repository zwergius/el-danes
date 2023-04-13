const { VITE_EMAIL, VITE_PHONE_NO } = import.meta.env

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession() {
  return {
    email: VITE_EMAIL,
    phoneNo: VITE_PHONE_NO,
  }
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event)

  // read language slug
  const [, lang] = event.url.pathname.split('/')

  // replace html lang attribute with correct language
  const body = await response.text()
  return new Response(
    body.replace('<html lang="en">', `<html lang="${lang}">`),
    response
  )
}
