<script context="module" lang="ts">
  import { baseLocale, locales } from '$i18n/i18n-util'
  import { loadLocaleAsync } from '$i18n/i18n-util.async'
  import { setLocale } from '$i18n/i18n-svelte'

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ params, session, url }) {
    const { pathname } = url
    const { lang } = params
    const { locale } = session

    console.log('accept-language: ', locale)
    console.log('url: ', url.pathname)

    // Redirect from root
    // if (pathname === '/') {
    //   console.log('302')
    //   const language = locales.includes(locale) ? locale : baseLocale

    //   return {
    //     status: 302,
    //     redirect: `/${language}`,
    //   }
    // }
    // // Unsupported language redirect to 404
    // if (!locales.includes(lang)) {
    //   console.log('404')
    //   return {
    //     status: 404,
    //     error: new Error(`${lang} language is not supported.`),
    //   }
    // }

    await loadLocaleAsync(lang)
    setLocale(lang)

    return {
      status: 200,
    }
  }
</script>

<script lang="ts">
  import '../app.postcss'
</script>

<slot />
