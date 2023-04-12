import { dev } from '$app/environment'
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ params }) {
  const page = params.page === 'home' ? '' : `${params.page}/`

  const url = dev
    ? `http://localhost:5173/code-mock${page}.txt`
    : `https://raw.githubusercontent.com/zwergius/el-danes/master/src/routes/%5Blang%5D/${page}+page.svelte`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'zwergius',
      'content-type': 'application/text',
    },
  })

  if (!res.ok) {
    return new Response(undefined, { status: 404 })
  }
  return new Response(await res.text(), { status: res.status })
}
