import fetch from 'node-fetch'
let json

export async function get(req, res) {
  const url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/mock.json'
      : 'https://api.github.com/repos/zwergius/el-danes/contents/src/routes/%5Blang%5D/index.svelte'
  if (!json) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'zwergius',
      },
    })
    json = await response.text()
  }

  res.writeHead(200, {
    'Content-Type': 'application/json',
  })

  res.end(json)
}
