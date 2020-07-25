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
  import Code from '@/components/Code.svelte'
  import FlipButton from '@/components/FlipButton.svelte'

  export let segment
  let showsCode = false

  function toggleFlip() {
    showsCode = !showsCode
  }

  const aspectRatio = 296.6 / 1197.07 // logo svg viewbox
  let w
  let h

  $: logoHeight = (w * aspectRatio).toFixed(2)

  function turn(node, { delay = 0, duration = 500 }) {
    return {
      delay,
      duration,
      css: (t, u) => `
      transform: rotateY(${1 - u * 180}deg) translate3d(0,0,0);
      opacity: ${1 - u};
      `,
    }
  }
</script>

<!-- TODO could we avoid init-theme with #if process browser here-->
<header bind:clientWidth="{w}">
  <div class="row">
    <LanguageSelector {segment} />
    <Anchor id="contact-link" href="/contact">{$_('contact')}</Anchor>
    <div class="row">
      <FlipButton {toggleFlip} flipped="{showsCode}" />
      <ThemeSelector />
    </div>
  </div>
</header>

<main style="margin-top:{logoHeight}px; height: {h}px;">
  <div class="logo-wrapper">
    <Logo turn="{showsCode}" />
  </div>
  <div class="scene">
    {#if !showsCode}
      <section class="side front" bind:clientHeight="{h}" transition:turn>
        {#if w}
          <slot />
        {/if}
      </section>
    {:else}
      <section class="side back" bind:clientHeight="{h}" transition:turn>
        <Code data="{$pageCode}" />
      </section>
    {/if}
  </div>
</main>

<Clients />

<style>
  header {
    position: fixed;
    z-index: 10;
    left: 0;
    top: var(--space-2);
    right: 0;
    font-size: var(--font-3);
    color: var(--text);
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: var(--space-2);
  }

  :global(#contact-link) {
    text-transform: uppercase;
  }

  :global(#contact-link::after) {
    background-color: var(--text);
  }

  .logo-wrapper {
  }

  main {
    position: relative;
    font-size: var(--font-5);
    width: 100%;
    background: transparent;
  }

  .scene {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .side {
    position: absolute;
    width: 100%;
    padding: var(--space-3) 0;
    overflow: hidden;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  @supports (mix-blend-mode: difference) {
    main,
    .scene {
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

    .side {
      padding: var(--space-5) 0;
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
