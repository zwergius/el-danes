<script context="module">
  import { waitLocale } from 'svelte-i18n'
  export async function preload() {
    return waitLocale()
  }
</script>

<script>
  import { _ } from 'svelte-i18n'
  import { pageCode } from '@/stores.js'
  import LanguageSelector from '@/components/LanguageSelector.svelte'
  import ThemeSelector from '@/components/ThemeSelector.svelte'
  import Logo from '@/components/Logo.svelte'
  import Clients from '@/components/Clients.svelte'
  import Anchor from '@/components/Anchor.svelte'
  import Flip from '@/components/Flip.svelte'
  import Code from '@/components/Code.svelte'

  export let segment
  let code = ''
  let showsCode = false

  function handleClick() {
    showsCode = !showsCode
  }

  const aspectRatio = 296.6 / 1197.07 // logo svg viewbox
  let w

  $: margin = (w * aspectRatio).toFixed(2)
</script>

<!-- TODO could we avoid init-theme with #if process browser here-->
<header bind:clientWidth="{w}">
  <div class="row">
    <LanguageSelector {segment} />
    <Anchor id="contact-link" href="/contact">{$_('contact')}</Anchor>
    <div>
      <button type="button" on:click="{handleClick}">CLICK</button>
      <ThemeSelector />
    </div>
  </div>
</header>

<main class:showsCode>
  <Logo isFolded="{showsCode}" />
  {#if w}
    <section class="main" style="margin-top:{margin}px">
      <slot {code} />
    </section>
    <section class="code">
      <Code data="{$pageCode}" />
    </section>
  {/if}
</main>

<!-- 
<Flip isFlipped="{showsCode}">

  <main slot="front" style="margin-top:{margin}px">
    <Logo />
    {#if w}
      <slot />
    {/if}
  </main>

  <div slot="back">
    <Code />
  </div>
</Flip>
-->
<Clients />

<style>
  header {
    position: fixed;
    z-index: 10;
    left: 0;
    top: var(--space-2);
    right: 0;
    font-size: var(--font-3);
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: var(--space-2);
  }

  :global(#contact-link) {
    text-transform: uppercase;
    font-size: inherit;
  }

  main {
    margin: 0 auto;
    padding: var(--space-3) 0;
    box-sizing: border-box;
    overflow-x: hidden;
    display: flex;
  }

  main.showsCode > section {
    width: 50%;
  }

  section {
    transition: all 1s;
  }

  section.main {
    width: 100%;
    font-size: var(--font-5);
  }

  section.code {
    width: 0;
  }

  @supports (mix-blend-mode: difference) {
    section.main {
      color: white;
      mix-blend-mode: difference;
    }
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
    main {
      padding: var(--space-5) 0;
    }
  }
</style>
