import { dev } from '$app/env'

/** @type {import('@sveltejs/kit').RequestHandler */
export async function get({ params }) {
  const page = params.page === 'home' ? '' : `${params.page}/`
  const url = dev
    ? 'http://localhost:3000/code-mock'
    : `https://raw.githubusercontent.com/zwergius/el-danes/master/src/routes/%5Blang%5D/${page}index.svelte`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'zwergius',
      'content-type': 'application/text',
    },
  })

  if (!res.ok) {
    return {
      status: 404,
    }
  }

  return {
    status: res.status,
    body: await res.text(),
  }
}
