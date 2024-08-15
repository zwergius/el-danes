import sveltePreprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'
// import path from 'path'

// /** @type {import('@sveltejs/kit').PrerenderErrorHandler} */
// const handleError = ({ status, path, referrer, referenceType }) => {
//   // if (path.startsWith('/blog')) throw new Error('Missing a blog page!');
//   console.warn(
//     `${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`
//   )
// }

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    sveltePreprocess({
      lang: ['postcss'],
    }),
  ],
  kit: {
    // By default, `npm run build` will create a standard Node app.
    // You can create optimized builds for different platforms by
    // specifying a different adapter
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    alias: {
      $lib: 'src/lib',
      '$lib/*': 'src/lib/*',
      $i18n: 'src/i18n',
      '$i18n/*': 'src/i18n/*',
    },

    prerender: {
      crawl: true,

      entries: [
        '/da',
        '/es',
        '/en',
        '/da/cases',
        '/es/cases',
        '/en/cases',
        '/da/contact',
        '/en/contact',
        '/es/contact',
        '/es/contact/christian',
        '/en/contact/christian',
        '/da/contact/christian',
        '*',
      ],
    },
  },
}

export default config
