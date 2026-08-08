# Quality, styling, and test toolchain research

Research date: 2026-08-08

Baseline: `origin/master` at `97ed2bc84eb9de0c382f5d2248ea1bfc6fa5c8e6`

Decision ticket: [Research the current quality, styling, and test toolchain](https://github.com/zwergius/el-danes/issues/127)

## Answer

The newest stable, mutually compatible quality stack is viable on Node.js
24 LTS, but it is not a version-only update. It requires an ESLint flat-config
migration, a Svelte 5 sequencing gate for the formatter, cleanup of obsolete
Husky and lint-staged configuration, and explicit reinstallation and execution
of every configured Playwright browser.

Two packages cannot follow the repository-wide "latest major" rule immediately:

- TypeScript must remain on **6.0.3** while the latest `typescript-eslint`
  release supports TypeScript only through `<6.1.0`; TypeScript 7.0.2 is outside
  that peer range. The supported ESLint range already includes ESLint 10.
  ([typescript-eslint dependency policy](https://typescript-eslint.io/users/dependency-versions/),
  [TypeScript 6.0.3 registry metadata](https://registry.npmjs.org/typescript/6.0.3),
  [TypeScript latest metadata](https://registry.npmjs.org/typescript/latest))
- `prettier-plugin-svelte` 4 requires Svelte 5. Until the Svelte migration lands,
  the compatible formatter is the latest v3 release, **3.5.2**. After Svelte 5,
  move to **4.1.1**.
  ([plugin compatibility and setup](https://github.com/sveltejs/prettier-plugin-svelte/blob/main/README.md),
  [v4 changelog](https://github.com/sveltejs/prettier-plugin-svelte/blob/main/CHANGELOG.md))

Node.js **24.16.0** is the current latest LTS release and clears every engine
floor below. In particular, cssnano 8 requires Node `^24.11.0` on the Node 24
line, lint-staged 17 requires `>=22.22.1`, and ESLint 10 requires Node
`^20.19.0 || ^22.13.0 || >=24`.
([Node release index](https://nodejs.org/dist/index.json),
[Node release schedule](https://github.com/nodejs/Release#release-schedule))

## Recommended release set

The versions below were read from the official npm registry metadata on the
research date. Supporting packages marked "add" are part of the official flat
config recipes.

| Area | Current baseline | Recommended stable release | Compatibility decision |
| --- | --- | --- | --- |
| Browser tests | `@playwright/test` 1.62.0 | [`@playwright/test` 1.62.1](https://registry.npmjs.org/@playwright%2ftest/latest) | Node `>=20`; reinstall its matching browser binaries after the package update. |
| Accessibility | `@axe-core/playwright` 4.12.1 | [`@axe-core/playwright` 4.12.1](https://registry.npmjs.org/@axe-core%2fplaywright/latest) | Already current; its `playwright-core >=1.0.0` peer range accepts Playwright 1.62.1. |
| Linter core | ESLint 8.57.0 | [ESLint 10.8.1](https://registry.npmjs.org/eslint/latest) | Requires flat config and Node 20.19/22.13/24+. |
| Core rules | implicit `eslint:recommended` | [`@eslint/js` 10.0.1](https://registry.npmjs.org/@eslint%2fjs/latest) (add) | Flat config imports the core recommended rules from this package. |
| TypeScript linting | parser and plugin 8.1.0 | [`typescript-eslint` 8.66.0](https://registry.npmjs.org/typescript-eslint/latest) | Replace the two separately configured packages with the aggregate package used by the official flat-config recipe. Supports ESLint 8.57/9/10 and TypeScript `>=4.8.4 <6.1.0`. |
| Svelte linting | `eslint-plugin-svelte` 2.43.0 | [`eslint-plugin-svelte` 3.22.0](https://registry.npmjs.org/eslint-plugin-svelte/latest) | v3 is flat-config only; supports ESLint 8.57.1/9/10 and Svelte 3/4/5. |
| Globals | implicit `env` blocks | [`globals` 17.9.0](https://registry.npmjs.org/globals/latest) (add) | Flat config declares browser and Node globals explicitly. |
| Prettier conflict config | `eslint-config-prettier` 9.1.0 | [`eslint-config-prettier` 10.1.8](https://registry.npmjs.org/eslint-config-prettier/latest) | Keep and place its flat config after rule-bearing configs. |
| Prettier ESLint rule | installed but unused 5.2.1 | Remove `eslint-plugin-prettier` | The repository already runs Prettier separately; Prettier documents this plugin as slower and generally not recommended. |
| Formatter | Prettier 3.3.3 | [Prettier 3.9.6](https://registry.npmjs.org/prettier/latest) | Pin the exact version, because even patches can change formatting output. |
| Svelte formatter | `prettier-plugin-svelte` 3.2.6 | [4.1.1](https://registry.npmjs.org/prettier-plugin-svelte/latest) after Svelte 5; otherwise 3.5.2 | v4 requires Node 20+, Prettier 3, and Svelte 5; it removes `svelteBracketNewLine` and `svelteStrictMode`. Neither removed option is present here. |
| CSS processor | PostCSS 8.4.41 | [PostCSS 8.5.26](https://registry.npmjs.org/postcss/latest) | Same major and no project configuration migration is required. |
| PostCSS config loader | 6.0.1 | [6.0.1](https://registry.npmjs.org/postcss-load-config/latest) | Already current; Node `>=18` and PostCSS `>=8.0.9`. |
| Prefixing | Autoprefixer 10.4.20 | [Autoprefixer 10.5.4](https://registry.npmjs.org/autoprefixer/latest) | Same major; supports PostCSS `^8.1.0`. Recheck the resolved Browserslist target set. |
| CSS minification | cssnano 7.0.5 | [cssnano 8.0.4](https://registry.npmjs.org/cssnano/latest) | Requires Node `^22.11.0 || ^24.11.0 || >=26` and PostCSS `^8.5.25`; v8 removes declaration sorting from the default preset. |
| Git hooks | Husky 9.1.4 | [Husky 9.1.7](https://registry.npmjs.org/husky/latest) | Add the `prepare` lifecycle and remove obsolete v4/v8-era configuration and hook bootstrap. |
| Staged checks | lint-staged 15.2.9 | [lint-staged 17.3.0](https://registry.npmjs.org/lint-staged/latest) | Requires Node `>=22.22.1` and Git `>=2.32.0`; use a JS config for full-project tasks that must not receive filenames. |
| Dev process runner | concurrently 8.2.2 | [concurrently 10.0.4](https://registry.npmjs.org/concurrently/latest) | Requires Node `>=22` and is ESM-only. The repository only uses the CLI, and its current quoted-command syntax remains supported. |

## Required configuration migrations

### ESLint, TypeScript-ESLint, and Svelte

ESLint 10 removes eslintrc support entirely, so `.eslintrc.cjs` cannot remain.
The replacement should be an ESM `eslint.config.js` composed from
`@eslint/js`, `typescript-eslint`, `eslint-plugin-svelte`, `globals`, and the
Prettier conflict config. ESLint 10 also enables three more rules in
`eslint:recommended`: `no-unassigned-vars`, `no-useless-assignment`, and
`preserve-caught-error`; their findings must be fixed or deliberately configured.
([ESLint 10 migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0),
[typescript-eslint flat-config quickstart](https://typescript-eslint.io/getting-started/),
[Svelte ESLint user guide](https://sveltejs.github.io/eslint-plugin-svelte/user-guide/))

The current `env`, top-level parser, Svelte override, and
`settings['svelte/typescript']` wiring should be translated to the official flat
recipe: explicit globals, `ts.configs.recommended`, `svelte.configs.recommended`,
and the TypeScript parser under the Svelte files' parser options. The v3 Svelte
recommended set adds rules and can therefore reveal new findings even when the
application code is unchanged.
([eslint-plugin-svelte v2-to-v3 migration](https://sveltejs.github.io/eslint-plugin-svelte/migration/))

Flat config does not read `.eslintignore`, and `--ignore-path` is unsupported.
Move repository-specific patterns into a global `ignores` entry and use the
current `includeIgnoreFile` export from `eslint/config` if `.gitignore` remains
the source of truth. Then remove `--ignore-path .gitignore` and
`--ignore-path .eslintignore` from package scripts. Dotfiles are no longer
ignored implicitly, so decide that pattern explicitly.
([ESLint configuration migration guide](https://eslint.org/docs/latest/use/configure/migration-guide))

Use explicit script targets after migration, for example the semantics of
`eslint . --max-warnings=0` and `prettier --check .`; do not preserve the
current target-less `check:lint` / `check:prettier` commands. Preserve the
project's custom quality rules, but let the TypeScript rule own unused-variable
checking for TypeScript/Svelte files so the core and typed rules do not report
the same issue.

### Prettier

Keep Prettier as a separate formatter and `eslint-config-prettier` as the rule
conflict suppressor. Remove `eslint-plugin-prettier`: it is installed but not
enabled in the current config, and Prettier recommends direct `prettier --check`
over running formatting as an ESLint rule because the plugin is slower and adds
indirection. Pin Prettier exactly rather than with `^`.
([Prettier linter integration guidance](https://prettier.io/docs/integrating-with-linters.html),
[Prettier installation and CI guidance](https://prettier.io/docs/install))

The existing `.prettierrc.json` already names `prettier-plugin-svelte`, which is
required with Prettier 3. After the Svelte 5 gate, v4 can use the current
options unchanged. Expect a one-time formatting diff and review it separately
from behavior changes.

### PostCSS, Autoprefixer, and cssnano

The existing `postcss.config.cjs` shape remains valid: Autoprefixer always runs,
and cssnano's default preset runs outside development. Upgrade PostCSS to at
least 8.5.25 before cssnano 8 to satisfy the peer dependency; the recommended
8.5.26 does so.

cssnano 8 deliberately removes `cssDeclarationSorter` from the default preset
because new CSS longhands could make reordering unsafe. Do not opt back into
sorting merely to preserve byte-for-byte output; the destination requires
behavioral equivalence, and the safer default is appropriate. Production CSS
may therefore differ in declaration order or size.
([cssnano 8 changelog](https://cssnano.github.io/cssnano/docs/changelog/),
[cssnano configuration](https://cssnano.github.io/cssnano/docs/config-file/))

The current Browserslist entry mixes browser and Node targets. That is accepted
syntax, but Autoprefixer only derives CSS prefixes from the browser portion.
Record `autoprefixer --info` before and after the upgrade so changes caused by
new browser data are visible rather than mistaken for cssnano regressions.
([Autoprefixer debugging guidance](https://github.com/postcss/autoprefixer#debug),
[Browserslist query reference](https://github.com/browserslist/browserslist#queries))

### Husky and lint-staged

Remove the obsolete top-level `husky.hooks` object from `package.json`; modern
Husky uses files under `.husky/`. Add `"prepare": "husky"` so a clean `npm ci`
installs the hooks. In `.husky/pre-commit`, delete both the shell shebang and
the line sourcing `_/husky.sh`; the v9 hook should contain only the command to
run, such as `npx lint-staged`.
([Husky setup](https://typicode.github.io/husky/get-started.html),
[Husky manual setup](https://typicode.github.io/husky/how-to.html#manual-setup))

The current lint-staged array is not safe to carry forward mechanically:

- lint-staged always appends matching filenames to string tasks;
- `svelte-check` is a full-project check, not a staged-file linter;
- `npm run check:prettier -- --write` combines a check-mode script with a write
  flag instead of expressing the desired task directly.

Move lint-staged configuration to `lint-staged.config.js`. Use direct,
file-aware tasks such as `prettier --write` and `eslint --fix` for matched files,
and represent any full-project `svelte-check` task with a function returning the
command so filenames are not appended. v17.3 explicitly documents this split.
([lint-staged configuration](https://github.com/lint-staged/lint-staged#configuration),
[lint-staged 17.3 changelog](https://github.com/lint-staged/lint-staged/blob/main/CHANGELOG.md#1730))

lint-staged 16 removed shell evaluation and changed process spawning; v17 then
raised the floors to Node 22.22.1 and Git 2.32.0. The proposed commands do not
depend on removed shell behavior.
([lint-staged 16 and 17 migration notes](https://github.com/lint-staged/lint-staged/blob/main/CHANGELOG.md#1700))

### Playwright and axe

The Playwright package update is only 1.62.0 to 1.62.1, but browser binaries are
version-coupled to Playwright and must be reinstalled after every update.
Playwright 1.62 also drops Debian 11 support. The repository's locators and
configuration do not use APIs removed in the recent 1.60 release, so no test
rewrite is identified from source inspection.
([Playwright 1.62 release notes](https://github.com/microsoft/playwright/releases/tag/v1.62.0),
[Playwright browser management](https://playwright.dev/docs/browsers))

`@axe-core/playwright` is already current. axe-core 4.12 added an `aria-tab-name`
rule and changed other checks, so an update from older lockfile contents can
surface or clear findings even without application changes. Preserve the
repository's explicit exception mechanism; do not blanket-disable a new rule.
Automated scans also do not replace manual accessibility assessment.
([axe-core 4.12 release](https://github.com/dequelabs/axe-core/releases/tag/v4.12.0),
[Playwright accessibility guidance](https://playwright.dev/docs/accessibility-testing))

### concurrently

concurrently 10 is ESM-only, changes default prefix colors, and removes the
deprecated `--name-separator` CLI flag and `killOthers` API option. None of
those removed surfaces are used here. The current package script's quoted
commands are still the documented cross-platform CLI form, so the only required
change is the version and Node floor.
([concurrently 10 release](https://github.com/open-cli-tools/concurrently/releases/tag/v10.0.0),
[current CLI usage](https://github.com/open-cli-tools/concurrently#usage))

## Sequencing and verification

1. Establish Node 24.16.0 and npm lockfile reproducibility first.
2. Land the Svelte 5 migration before `prettier-plugin-svelte` 4. If quality
   tooling must move first, use plugin 3.5.2 temporarily and make the v4 step an
   explicit follow-up.
3. Migrate ESLint configuration and scripts together with ESLint 10,
   `typescript-eslint` 8.66, Svelte ESLint 3.22, and TypeScript 6.0.3. Do not
   advance TypeScript to 7 until `typescript-eslint` publishes support.
4. Upgrade and pin Prettier, then commit its one-time formatting output
   separately so it is reviewable.
5. Upgrade PostCSS/Autoprefixer/cssnano and compare a production build's rendered
   pages and CSS, not declaration order alone.
6. Repair Husky/lint-staged and test the hook in a disposable branch or
   worktree with representative staged JS, TypeScript, Svelte, and JSON files.
7. Upgrade Playwright last, reinstall browsers, and run the entire configured
   browser matrix plus axe scans.

For each implementation cluster:

- begin with a clean `npm ci` on Node 24.16.0;
- run `npm run check`, `npm run lint`, `npm run check:e2e`, and a production
  `npm run build` as applicable;
- run `npx autoprefixer --info` and inspect the generated production CSS for the
  CSS cluster;
- run `npx playwright install --with-deps` after the Playwright update, then
  `npm run test:e2e:project` so Chromium, Firefox, and WebKit all execute; the
  shorter `npm run test:e2e` command covers only the two Chromium projects;
- finish runtime-affecting clusters with the repository-mandated
  `npm run verify` and preview E2E result.

Playwright's official CI sequence is `npm ci`, browser installation with system
dependencies, then `playwright test`; it also recommends one worker in CI for
stability. The repository currently uses two CI workers. Reducing that to one is
a reasonable reliability follow-up, but it is not required for compatibility
and should be measured against preview duration.
([Playwright CI guidance](https://playwright.dev/docs/ci),
[Playwright CLI](https://playwright.dev/docs/test-cli))

## Replacement and removal summary

- Replace `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser`
  direct configuration with the `typescript-eslint` aggregate package.
- Add `@eslint/js` and `globals` for the official flat-config composition.
- Remove `eslint-plugin-prettier`; retain `eslint-config-prettier`.
- Remove `.eslintrc.cjs`, `.eslintignore` after its patterns are migrated, the
  package-level `husky` object, and the obsolete Husky bootstrap lines.
- Retain PostCSS, `postcss-load-config`, Autoprefixer, cssnano, Husky,
  lint-staged, concurrently, Playwright, and axe; all remain maintained and
  serve distinct responsibilities in this repository.
