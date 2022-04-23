<script context="module" lang="ts">
  import { baseLocale, locales } from '$i18n/i18n-util'
  import { loadLocaleAsync } from '$i18n/i18n-util.async'
  import { setLocale } from '$i18n/i18n-svelte'

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ params, url }) {
    const { pathname } = url
    const { lang } = params

    // Redirect from root NOT WORKING with static-adapter
    if (pathname === '/') {
      return {
        status: 302,
        redirect: `/${baseLocale}`,
      }
    }
    // Unsupported language redirect to 404
    if (!locales.includes(lang)) {
      return {
        status: 404,
        error: new Error(`${lang} language is not supported.`),
      }
    }

    await loadLocaleAsync(lang)
    setLocale(lang)

    return {
      status: 200,
    }
  }
</script>

<script lang="ts">
  import '../app.css'
</script>

<slot />
