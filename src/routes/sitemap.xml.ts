const languages = ['en', 'es', 'da']
const pages = ['', 'contact', 'cases']
const baseUrl = `https://www.xn--eldans-fva.com`

const render = (languages: string[], pages: string[]) => `
  <?xml version="1.0" encoding="UTF-8" ?>
  <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${languages
      .map((language) => {
        return pages
          .map((page) => `<url><loc>${baseUrl}/${language}/${page}</loc></url>`)
          .join(`\n`)
      })
      .join(`\n`)}
  </urlset>
`

export function get() {
  return {
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=3600',
      'Content-Type': 'application/rss+xml',
    },
    body: render(languages, pages),
  }
}
