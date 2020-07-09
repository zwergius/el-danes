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
  <div class="row">
    <LanguageSelector {segment} />
    <a href="#">{$_('contact')}</a>
    <ThemeSelector />
  </div>
  <Logo />
</header>

<main>
  <slot />
</main>
<Clients />

<style>
  header {
    position: fixed;
    z-index: 10;
    left: 0;
    top: var(--space-2);
    right: 0;
    font-size: var(--font-0);
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: var(--space-2);
  }

  main {
    position: relative;
    margin: 0 auto;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    display: block;
    text-transform: uppercase;
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    header {
      left: var(--space-3);
      top: var(--space-1);
      right: var(--space-2);
    }

    .row {
      padding: 0;
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    header {
      left: var(--space-5);
      top: var(--space-2);
      right: var(--space-5);
    }
  }
</style>
