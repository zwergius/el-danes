import sveltePreprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'
import path from 'path'

/** @type {import('@sveltejs/kit').PrerenderErrorHandler} */
const handleError = ({ status, path, referrer, referenceType }) => {
  // if (path.startsWith('/blog')) throw new Error('Missing a blog page!');
  console.warn(
    `${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`
  )
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    sveltePreprocess({
      lang: 'postcss',
    }),
  ],
  kit: {
    // By default, `npm run build` will create a standard Node app.
    // You can create optimized builds for different platforms by
    // specifying a different adapter
    adapter: adapter({
      fallback: '404.html'
    }),
    prerender: {
      crawl: true,
      default: true,
      enabled: true,
      onError: handleError,
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
        '*',
      ],
    },

    vite: {
      plugins: [],
      resolve: {
        alias: {
          $i18n: path.resolve('./src/i18n'),
          $lib: path.resolve('./src/lib'),
        },
      },
    },
  },
}

export default config
