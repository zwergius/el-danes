import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import inlineSvg from 'rollup-plugin-inline-svg'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import yaml from '@rollup/plugin-yaml'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const onwarn = (warning, onwarn) => {
  if (warning.code === 'THIS_IS_UNDEFINED') return // https://github.com/rollup/rollup/issues/794
  return (
    (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
    (warning.code === 'CIRCULAR_DEPENDENCY' &&
      /[/\\]@sapper[/\\]/.test(warning.message)) ||
    onwarn(warning)
  )
}

const preprocessOptions = {
  transformers: {
    postcss: {
      plugins: [
        require('postcss-import')(),
        require('postcss-url')(),
        require('autoprefixer')(),
      ],
    },
  },
}

const aliases = alias({
  resolve: ['.js, .svelte', '/index.svelte'],
  entries: [
    {
      find: '@',
      replacement: path.resolve(__dirname, 'src'),
    },
    { find: 'assets', replacement: 'src/assets' },
    { find: 'components', replacement: 'src/components' },
  ],
})
const projectRootDir = path.resolve(__dirname)

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      aliases,
      json(),
      yaml(),
      inlineSvg(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      svelte({
        preprocess: require('svelte-preprocess')(preprocessOptions),
        compilerOptions: {
          dev,
          hydratable: true,
        },
      }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),

      legacy &&
        babel({
          extensions: ['.js', '.mjs', '.html', '.svelte'],
          babelHelpers: 'runtime',
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead',
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: config.server.input(),
    output: { ...config.server.output(), exports: 'default' },
    plugins: [
      aliases,
      json(),
      yaml(),
      inlineSvg(),
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.VERCEL_GITHUB_COMMIT_SHA': JSON.stringify(
          process.env.VERCEL_GITHUB_COMMIT_SHA || Date.now()
        ),
      }),
      svelte({
        preprocess: require('svelte-preprocess')(preprocessOptions),
        compilerOptions: {
          generate: 'ssr',
          dev,
          hydratable: true,
        },
        emitCss: false,
      }),
      resolve({
        dedupe: ['svelte'],
      }),
      commonjs(),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules ||
        Object.keys(process.binding('natives'))
    ),

    preserveEntrySignatures: 'strict',
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.VERCEL_GITHUB_COMMIT_SHA': JSON.stringify(
          process.env.VERCEL_GITHUB_COMMIT_SHA || Date.now()
        ),
      }),
      commonjs(),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
}
