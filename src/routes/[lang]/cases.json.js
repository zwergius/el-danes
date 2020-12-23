import fetch from 'node-fetch'
let json

export async function get(req, res) {
  const url =
    'https://api.github.com/repos/zwergius/el-danes/contents/src/routes/%5Blang%5D/clients.svelte'
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
