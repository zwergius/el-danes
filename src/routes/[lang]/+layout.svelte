<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { pageHeader } from '$lib/stores'
  import Header from '$lib/components/Header.svelte'
  import ClientsSticker from '$lib/components/ClientsSticker.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import type { PageData } from './$types'

  const { lang } = $page.params

  let showsCode = true
  let h = 0
  // const aspectRatio = 296.6 / 1197.07 // logo svg viewbox
  let mounted = false
  onMount(() => {
    mounted = true
  })

  function toggleFlip() {
    showsCode = !showsCode
  }

  function turn(_node: Element, { delay = 0, duration = 500 }) {
    return {
      delay,
      duration,
      css: (_t: number, u: number) => `
      transform: rotate3d(0, 1, 0, ${1 - u * 180}deg);
      `,
    }
  }
</script>

<!-- TODO could we avoid init-theme with #if process browser here-->
{#if browser}
  <Header {lang} {showsCode} {toggleFlip} />
{/if}

<main style="height: {h}px; ">
  <div class="scene" class:mounted>
    {#if !showsCode}
      <div class="side front" transition:turn>
        <div class="content" bind:clientHeight={h}>
          <slot />
        </div>
      </div>
    {:else}
      <div class="side back" transition:turn>
        <div class="content" bind:clientHeight={h}>
          <code>{$page.data.code}</code>
        </div>
      </div>
    {/if}
  </div>
</main>

<ClientsSticker />

<Footer>{$pageHeader}</Footer>

<style>
  main {
    position: relative;
    width: 100%;
    flex: 1 0 auto;
  }

  .scene {
    position: absolute;
    width: 100%;
    height: 100%;
    /* z-index: 1; Safari hack */
    perspective: 900000px; /* Safari hack */
    transition: transform 0.6s cubic-bezier(0.64, 0, 0.78, 0);
  }

  .scene.mounted {
    transform: translateY(var(--header-height));
  }

  div.side {
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
    div.side {
      font-size: var(--font-7);
    }

    .content {
      padding: var(--space-3);
    }
  }
  /* Desktop - 1080px */
  @media only screen and (min-width: 67.5em) {
    .content {
      padding: var(--space-4);
    }
  }
  /* Desktop 2560px */
  @media only screen and (min-width: 160em) {
    div.side {
      font-size: var(--font-10);
    }

    .content {
      padding: var(--space-6);
    }
  }
</style>
