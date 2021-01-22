import fetch from 'node-fetch'
let json

export async function get(req, res) {
  const codeUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/code-mock'
      : 'https://raw.githubusercontent.com/zwergius/el-danes/main/src/routes/%5Blang%5D/cases/index.svelte'
  const experiencesUrl =
    'https://raw.githubusercontent.com/zwergius/XP/main/src/experiences.json'

  if (!json) {
    const [code, experiences] = await Promise.all([
      fetch(codeUrl, {
        headers: {
          'User-Agent': 'zwergius',
        },
      }).then((res) => res.text()),
      fetch(experiencesUrl, {
        headers: {
          'User-Agent': 'zwergius',
        },
      }).then((res) => res.text()),
    ])

    json = JSON.stringify({ code, experiences })
  }

  res.writeHead(200, {
    'Content-Type': 'application/json',
  })

  res.end(json)
}
