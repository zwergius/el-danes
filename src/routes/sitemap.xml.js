const languages = ['en', 'es', 'da']
const pages = ['', 'contact', 'clients']
const baseUrl = `https://www.xn--eldans-fva.com/sitemap.xml`

const render = (languages, pages) => `<?xml version="1.0" encoding="UTF-8" ?>
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

export function get(req, res) {
  res.setHeader('Cache-Control', `max-age=0, s-max-age=${600}`) // 10 minutes
  res.setHeader('Content-Type', 'application/rss+xml')

  const feed = render(languages, pages)
  res.end(feed)
}
