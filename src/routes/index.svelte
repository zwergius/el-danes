<script context="module">
  // This file is needed otherwise service-worker-index.html won't be added to build'
  const supportedLanguages = ['da', 'en', 'es']

  export async function preload() {
    // Generates sitemap when site is crawled
    this.fetch('sitemap.xml')

    if (process.browser) {
      const navigatorLocale =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage ||
        'en-US'

      const locale = navigatorLocale.split('-')[0]
      let language = 'en'
      if (supportedLanguages.indexOf(locale) !== -1) language = locale
      return this.redirect(303, language)
    }
  }
</script>
