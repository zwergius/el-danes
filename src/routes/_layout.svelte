<script context="module">
  import { waitLocale } from 'svelte-i18n'
  export async function preload(page, session) {
    await waitLocale()
    // TODO Read user session or cookie or url param or ...
    // return { theme: session.theme || 'dark' }
    return { theme: `dark` }
  }
</script>

<script>
  import { _ } from 'svelte-i18n'
  import LanguageSelector from '../components/LanguageSelector.svelte'
  import ThemeSelector from '../components/ThemeSelector.svelte'
  import Logo from '../components/Logo.svelte'

  export let segment
  export let theme
</script>

<svelte:head>
  <link rel="stylesheet" type="text/css" href="{theme}-theme.css" />
</svelte:head>

<header>
  <LanguageSelector {segment} />
  <a href="#">{$_('contact')}</a>
  <ThemeSelector {segment} />
  <Logo />
</header>
<main>
  <slot />
</main>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }

  main {
    position: relative;
    background-color: white;
    margin: 0 auto;
    box-sizing: border-box;
  }

  a {
    font-size: 48px;
    text-decoration: none;
    display: block;
    text-transform: uppercase;
  }
</style>
