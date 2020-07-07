<script context="module">
  import { waitLocale } from 'svelte-i18n'
  export async function preload() {
    return waitLocale()
  }
</script>

<script>
  import { _ } from 'svelte-i18n'
  import LanguageSelector from '../components/LanguageSelector.svelte'
  import ThemeSelector from '../components/ThemeSelector.svelte'
  import Logo from '../components/Logo.svelte'
  import Clients from '@/components/Clients.svelte'

  export let segment
</script>

<!-- TODO could we avoid init-theme with #if process browser here-->
<header>
  <LanguageSelector {segment} />
  <a href="#">{$_('contact')}</a>
  <ThemeSelector />
  <Logo />
</header>

<main>
  <slot />
</main>
<Clients />

<style>
  header {
    position: fixed;
    left: var(--space-5);
    top: 0;
    right: var(--space-5);
    display: flex;
    justify-content: space-between;
  }

  main {
    position: relative;
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
