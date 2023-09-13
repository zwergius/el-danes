import { dev } from '$app/environment'
/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const branch = dev ? 'dev' : 'main'
  const url =
    `https://raw.githubusercontent.com/zwergius/XP/${branch}/src/experiences.json`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'zwergius',
      'content-type': 'application/json',
    },
  })

  if (!res.ok) {
    return new Response(undefined, { status: 404 })
  }

  return new Response(await res.text(), { status: res.status })
}
