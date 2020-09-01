<script>
  import { _ } from 'svelte-i18n'
  import { stores } from '@sapper/app'
  const url = `www.eldanés.com`

  export let title = $_('meta.title')
  export let description = $_('meta.description')
  export let twitterImg = '' // 120x120

  const { page } = stores()
  export let fbImg = `https://${$page.host}/el-danes-tablet.jpg` // Recommended: up to 1200x630
  //  const url = $page.host.startsWith('www') ? $page.host : `www.${$page.host}`
  const path = $page.path.substring(3)

  const canonicalUrl = `https://${url}/${$page.params.lang}${path}`
  const siteName = 'El Danés Solutions'
  const metaTitle = title ? `${title} - ${siteName}` : siteName
</script>

<svelte:head>
  <title>{metaTitle}</title>
  <meta name="description" content="{description}" />
  <!-- Open Graph data -->
  <meta property="og:title" content="{metaTitle}" />
  <meta property="og:image" content="{fbImg}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{canonicalUrl}" />
  <meta property="og:site_name" content="{siteName}" />
  <!-- Twitter Card data -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:creator" content="@eldanes" />
  <meta name="twitter:title" content="{metaTitle}" />
  <meta name="twitter:site" content="@eldanes" />
  <meta name="twitter:image" content="{twitterImg}" />
  <meta name="twitter:description" content="{description}" />
  <!-- canonical & alternate -->
  <link rel="alternate" href="{`https://${url}/da${path}`}" hreflang="da-da" />
  <link rel="alternate" href="{`https://${url}/en${path}`}" hreflang="en-gb" />
  <link rel="alternate" href="{`https://${url}/es${path}`}" hreflang="es-es" />
  <link rel="canonical" href="{canonicalUrl}" />
</svelte:head>
