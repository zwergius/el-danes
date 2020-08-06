<script context="module">
  import { waitLocale } from 'svelte-i18n'
  export async function preload() {
    return waitLocale()
  }
</script>

<script>
  import { pageCode, pageHeader } from '@/stores.js'
  import Header from '@/components/Header.svelte'
  import ClientsSticker from '@/components/ClientsSticker.svelte'
  import Code from '@/components/Code.svelte'
  import Footer from '@/components/Footer.svelte'

  export let segment
  let showsCode = false

  function toggleFlip() {
    showsCode = !showsCode
  }

  let h = 0

  function turn(node, { delay = 0, duration = 500 }) {
    return {
      delay,
      duration,
      css: (t, u) => `
      transform: rotate3d(0, 1, 0, ${1 - u * 180}deg);
      `,
    }
  }
</script>

<!-- TODO could we avoid init-theme with #if process browser here-->
<Header {showsCode} {segment} {toggleFlip} />

<main style="height: {h}px;">
  <div class="scene">
    {#if !showsCode}
      <section class="side front" transition:turn>
        <div class="content" bind:clientHeight="{h}">
          <slot />
        </div>
      </section>
    {:else}
      <section class="side back" transition:turn>
        <div class="content" bind:clientHeight="{h}">
          <Code data="{$pageCode}" />
        </div>
      </section>
    {/if}
  </div>
</main>

<ClientsSticker />

<Footer>
  <h1>{$pageHeader}</h1>
</Footer>

<style>
  main {
    position: relative;
    width: 100%;
    flex: 1 0 auto;
    transition: margin 0.3s ease-in;
  }

  .scene {
    position: absolute;
    width: 100%;
    height: 100%;
    /* z-index: 1; Safari hack */
    perspective: 900000px; /* Safari hack */
  }

  section.side {
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: var(--font-6);
    overflow: hidden;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .content {
    padding: var(--space-3);
  }

  /* 
  @supports (mix-blend-mode: difference) {
    main,
    .scene {
      color: white;
      mix-blend-mode: difference;
    }
  } */

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    section.side {
      font-size: var(--font-7);
    }

    .content {
      padding: var(--space-3);
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    .content {
      padding: var(--space-4);
    }
  }
  /* Desktop 2560px*/
  @media only screen and (min-width: 160em) {
    section.side {
      font-size: var(--font-10);
    }

    .content {
      padding: var(--space-5);
    }
  }
</style>
