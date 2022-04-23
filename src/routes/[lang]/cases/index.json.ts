/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
  const url =
    'https://raw.githubusercontent.com/zwergius/XP/main/src/experiences.json'

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'zwergius',
      'content-type': 'application/json',
    },
  })

  if (!res.ok) {
    return {
      status: 404,
    }
  }
  return {
    status: res.status,
    body: await res.json(),
  }
}
