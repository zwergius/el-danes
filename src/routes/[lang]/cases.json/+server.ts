// @migration task: Check imports
/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const url =
    'https://raw.githubusercontent.com/zwergius/XP/main/src/experiences.json'

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
