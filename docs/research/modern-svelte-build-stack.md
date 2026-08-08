# Modern Svelte build stack

Research date: 2026-08-08

## Decision

Upgrade the application to the following stable, mutually compatible set. The
versions are the newest stable releases published when this research was done,
except where the ecosystem or the agreed Node.js LTS policy requires a lower
major.

| Package                        | Current   | Target                   | Decision                                                                                                                                        |
| ------------------------------ | --------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `svelte`                       | `^4.2.18` | `^5.56.8`                | Upgrade to Svelte 5.                                                                                                                            |
| `@sveltejs/kit`                | `^2.5.22` | `^2.70.2`                | Stay on major 2 and take the latest stable minor.                                                                                               |
| `@sveltejs/adapter-static`     | `^3.0.4`  | `^3.0.10`                | Stay on major 3; the existing adapter options remain supported.                                                                                 |
| `@sveltejs/vite-plugin-svelte` | `^3.1.1`  | `^7.3.0`                 | Upgrade with Svelte 5 and Vite 8.                                                                                                               |
| `vite`                         | `^5.4.1`  | `^8.2.1`                 | Upgrade to Vite 8 and its Rolldown/Oxc build pipeline.                                                                                          |
| `svelte-check`                 | `^3.8.5`  | `^4.7.5`                 | Upgrade to major 4.                                                                                                                             |
| `typescript`                   | `^5.5.4`  | `^6.0.3`                 | Stop at the newest 6.x release; TypeScript 7 is not yet accepted by SvelteKit or `svelte-check`.                                                |
| `@types/node`                  | `^26.1.2` | `^24.13.3`               | Align types with the agreed Node 24 LTS runtime rather than the current Node 26 line.                                                           |
| `svelte-preprocess`            | `^6.0.2`  | remove                   | Replace its only use with `vitePreprocess`.                                                                                                     |
| `@tsconfig/svelte`             | `^5.0.4`  | remove                   | It is not referenced; the project correctly extends SvelteKit's generated `.svelte-kit/tsconfig.json`.                                          |
| `tslib`                        | `^2.6.3`  | remove direct dependency | The project neither imports it nor enables TypeScript `importHelpers`; let transitive packages own it. If a direct need is found, use `^2.8.1`. |

The compatibility constraint is explicit in the publishers' metadata:
`@sveltejs/vite-plugin-svelte@7.3.0` requires Svelte `^5.46.4` and Vite 8,
while `@sveltejs/kit@2.70.2` accepts Vite 8, Svelte 5, plugin major 7, and
TypeScript 5 or 6. `svelte-check@4.7.5` likewise accepts TypeScript 5 or 6.
Consequently, the registry's current `typescript@7.0.2` cannot be part of this
set yet. These constraints and versions come from the official npm package
metadata for [Svelte](https://registry.npmjs.org/svelte/latest),
[SvelteKit](https://registry.npmjs.org/@sveltejs%2fkit/latest),
[adapter-static](https://registry.npmjs.org/@sveltejs%2fadapter-static/latest),
[vite-plugin-svelte](https://registry.npmjs.org/@sveltejs%2fvite-plugin-svelte/latest),
[Vite](https://registry.npmjs.org/vite/latest),
[svelte-check](https://registry.npmjs.org/svelte-check/latest),
[svelte-preprocess](https://registry.npmjs.org/svelte-preprocess/latest),
[TypeScript](https://www.npmjs.com/package/typescript?activeTab=versions),
[tslib](https://registry.npmjs.org/tslib/latest),
[@types/node](https://www.npmjs.com/package/%40types/node?activeTab=versions),
and [@tsconfig/svelte](https://registry.npmjs.org/@tsconfig%2fsvelte/latest).

## Required migration constraints

### Svelte and SvelteKit

Svelte 5 can compile existing Svelte 4 syntax in legacy mode, so changing the
dependency does not require converting every component to runes in the same
commit. The repository currently uses legacy reactive statements, `export let`,
`on:` event directives, `$$restProps`, and slots. Those constructs can remain
for the initial dependency upgrade, which keeps the migration reviewable and
reduces behavior risk. Svelte's official migration guide confirms that legacy
and runes components can coexist and documents `npx sv migrate svelte-5` for a
later source conversion ([Svelte 5 migration guide](https://svelte.dev/docs/svelte/v5-migration-guide),
[Svelte CLI migration reference](https://svelte.dev/docs/cli/sv-migrate)).

Do migrate the six repository imports from `$app/stores` to `$app/state` after
Svelte 5 is installed. `$app/stores` has been deprecated since SvelteKit 2.12
and is subject to removal in SvelteKit 3. The official migration is
`npx sv migrate app-state`; usages change from store auto-subscription such as
`$page.data` to `page.data` ([SvelteKit migration guide](https://svelte.dev/docs/kit/migrating-to-sveltekit-2)).
Treat this as a separate source migration after the dependency-only checkpoint.

If the project chooses to run the Svelte 5 source migration, review its output
rather than accepting it mechanically. The repository has reactive statements,
custom `on:pan*` action events, slot forwarding, and rest-prop forwarding.
Svelte documents that the migrator can leave `svelte/legacy` stopgaps and does
not safely automate every lifecycle or component-event case
([migration script limitations](https://svelte.dev/docs/svelte/v5-migration-guide#Migration-script)).
Preserving the current behavior does not require completing that optional syntax
conversion in this dependency cluster.

Svelte 5 no longer supports Internet Explorer and relies on modern browser APIs
including `Proxy` and `ResizeObserver`. This is consistent with the repository's
explicit IE exclusions, but the supported-browser decision must also account
for Vite 8's newer output target
([Svelte browser requirement](https://svelte.dev/docs/svelte/v5-migration-guide#Modern-browser-required)).

### Preprocessing and configuration

Replace the current `svelte-preprocess({ lang: ['postcss'] })` configuration
with `vitePreprocess()` imported from `@sveltejs/vite-plugin-svelte`, then remove
`svelte-preprocess`. The project only needs PostCSS in component styles, which
`vitePreprocess` supports directly; the official SvelteKit integration guide
says it is the default, faster, lower-configuration choice. `svelte-preprocess`
is only needed for additional features such as Pug, Babel, or global styles,
none of which this repository uses
([SvelteKit preprocessing guidance](https://svelte.dev/docs/kit/integrations#Preprocessors-vitePreprocess)).

Keep the existing `adapter-static` settings (`pages`, `assets`, `fallback`,
`precompress`, and `strict`): all remain current API. Retain `strict: true` and
verify that all routes are still prerendered; the adapter documents this as the
safety check that prevents inaccessible output
([adapter-static options](https://svelte.dev/docs/kit/adapter-static#Options)).

The aliases already declared in `svelte.config.js` are SvelteKit's canonical
aliases. Remove the duplicate aliases and `path` import from `vite.config.js`
when modernizing configuration; this avoids two sources of truth. Keep
`tsconfig.json` extending `.svelte-kit/tsconfig.json`, and regenerate that file
with `svelte-kit sync` after installation. SvelteKit's generated config uses
bundler module resolution and its migration guide directs projects to define
aliases in `svelte.config.js`
([SvelteKit TypeScript configuration](https://svelte.dev/docs/kit/migrating-to-sveltekit-2)).

### Vite 8

The repository's Vite config does not use the low-level esbuild, Rollup,
dependency-optimizer, CommonJS, or plugin hooks affected by Vite 8's move to
Rolldown and Oxc. A direct Vite 8 upgrade is therefore the appropriate first
attempt. Vite says most projects can upgrade directly because compatibility
layers translate existing options; it recommends a Vite 7/`rolldown-vite`
intermediate step only for larger or more complex projects
([Vite 8 announcement](https://vite.dev/blog/announcing-vite8),
[Vite 8 migration guide](https://vite.dev/guide/migration.html)).

Vite 8 requires Node `^20.19.0 || >=22.12.0`; Node 24 LTS satisfies that
constraint. The more important behavior change for this static site is the
default production browser target, now Chrome 111, Edge 111, Firefox 114, and
Safari 16.4. Vite does not derive this JavaScript target from the repository's
`browserslist` field. Before implementation, either accept that Baseline target
as the support policy or set an explicit `build.target` after testing the older
browsers that must remain supported
([Vite browser compatibility](https://vite.dev/guide/build.html#browser-compatibility),
[Vite 8 migration guide](https://vite.dev/guide/migration.html#default-browser-target-change-nrv)).

### TypeScript 6

TypeScript 6 changes several defaults, including enabling `strict` and
`noUncheckedSideEffectImports`, defaulting modules to `esnext`, and setting the
default target to the current-year ECMAScript version. This repository already
sets `module`, `target`, and `lib` and inherits SvelteKit's generated compiler
configuration, so the expected work is to address diagnostics rather than add
compatibility flags pre-emptively. If Node globals or built-ins become missing,
TypeScript's migration guidance recommends adding an explicit
`"types": ["node"]`; do not use `ignoreDeprecations` as a permanent migration
strategy ([TypeScript 6 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)).

## Implementation sequence and verification

1. On Node 24 LTS, update the package versions as one lockfile-controlled stack,
   switch to `vitePreprocess`, remove the three unnecessary direct dependencies,
   simplify the duplicate aliases, and run `svelte-kit sync`.
2. Run the repository's `npm run check` immediately. The official checker finds
   Svelte, accessibility, CSS, JavaScript, and TypeScript diagnostics
   ([`sv check` reference](https://svelte.dev/docs/cli/sv-check)).
3. Run `npm run build` and inspect the generated static routes and `404.html`.
   Start `npm run preview` for production-output testing; Vite documents build
   followed by preview as its local static verification path
   ([Vite static deployment guide](https://vite.dev/guide/static-deploy.html)).
4. Run the repository's full `npm run verify`, including its desktop and mobile
   Playwright journeys. Compare key pages and interactions against the existing
   preview because Svelte 5 changes whitespace, scoped-CSS implementation,
   event handling, and hydration details even when legacy syntax remains.
5. Only after the stack is green, migrate `$app/stores` to `$app/state` and run
   the same full verification again. Treat an optional runes/syntax conversion
   as a later behavior-preserving change, not as a prerequisite for adopting
   the latest stable dependency majors.

## Remaining decision exposed by this research

The implementation needs an explicit browser-support decision. Accepting Vite
8's 2026 Baseline target is the simplest route and is compatible with Svelte 5,
but it narrows the JavaScript runtime floor compared with Vite 5. If preserving
older non-IE browsers is part of “current behavior,” document those concrete
browser versions and configure/test an explicit Vite target before the upgrade
is considered complete.
