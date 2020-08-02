<script context="module">
  import { waitLocale } from 'svelte-i18n'
  export async function preload() {
    return waitLocale()
  }
</script>

<script>
  import { pageCode } from '@/stores.js'
  import Header from '@/components/Header.svelte'
  import ClientsSticker from '@/components/ClientsSticker.svelte'
  import Code from '@/components/Code.svelte'

  export let segment
  let showsCode = false

  function toggleFlip() {
    showsCode = !showsCode
  }

  const aspectRatio = 296.6 / 1197.07 // logo svg viewbox
  let w = 0
  let h = 0

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
<Header {showsCode} {segment} {toggleFlip} />

<main bind:clientWidth="{w}" style="margin-top:{logoHeight}px; height: {h}px;">
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

<ClientsSticker />

<style>
  main {
    position: relative;
    font-size: var(--font-6);
    width: 100%;
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
    main {
      font-size: var(--font-7);
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    .side {
      padding: var(--space-4) 0;
    }
  }
  /* Desktop 2560px*/
  @media only screen and (min-width: 160em) {
    main {
      font-size: var(--font-10);
    }
    .side {
      padding: var(--space-5) 0;
    }
  }
</style>
