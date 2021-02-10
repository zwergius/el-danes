import fetch from 'node-fetch'
let json

export async function get(req, res) {
  const url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/code-mock'
      : 'https://raw.githubusercontent.com/zwergius/el-danes/master/src/routes/%5Blang%5D/contact/index.svelte'
  if (!json) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'zwergius',
      },
    })
    json = JSON.stringify(await response.text())
  }

  res.writeHead(200, {
    'Content-Type': 'application/json',
  })

  res.end(json)
}
