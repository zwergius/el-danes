<script>
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { back, contact, menu } from 'assets/translations.yaml'
  import { theme } from '@/stores.js'
  import Anchor from '@/components/Anchor.svelte'
  import Logo from '@/components/Logo.svelte'
  import LanguageSelector from '@/components/LanguageSelector.svelte'
  import ThemeSelector from '@/components/ThemeSelector.svelte'
  import FlipButton from '@/components/FlipButton.svelte'

  export let lang, toggleFlip, showsCode

  const aspectRatio = 296.6 / 1197.07 // logo svg viewbox
  let showsNavigation
  let height
  let headerHeight

  onMount(() => {
    showsNavigation = window.matchMedia('only screen and (min-width: 48em)')
      .matches
  })

  function toggleShowsNavigation() {
    showsNavigation = !showsNavigation
  }

  $: {
    if (isNaN(height)) headerHeight = 0
    else if (height > 0) headerHeight = height
    else headerHeight = window.innerWidth * aspectRatio
  }
</script>

<header bind:clientHeight={height}>
  {#if showsNavigation}
    <nav class="row {$theme && 'visible'}" transition:slide>
      <LanguageSelector {lang} />
      <Anchor id="contact-link" rel="prefetch" href="/contact">
        {contact[lang]}
      </Anchor>
      <div class="row">
        <FlipButton {toggleFlip} flipped={showsCode} />
        <ThemeSelector />
      </div>
    </nav>
  {/if}
  <Logo {lang} turn={showsCode}>
    <div class="handheld-row">
      <button on:click={toggleShowsNavigation} type="button">
        {showsNavigation ? back[lang] : menu[lang]}
      </button>
    </div>
  </Logo>
</header>

{#if headerHeight}
  <div
    style="height: {headerHeight.toFixed(2)}px;"
    class="height-faker"
    transition:slide />
{/if}

<style>
  header {
    position: fixed;
    z-index: 5;
    left: 0;
    top: 0;
    right: 0;
    font-size: var(--font-3);
    color: var(--text);
  }

  nav.row {
    opacity: 0;
    border-bottom: 1px solid var(--text);
    padding: var(--space-2) calc(var(--space-3) - var(--space-2)) var(--space-2)
      var(--space-3);
  }

  nav.row.visible {
    opacity: 1;
  }

  :global(#contact-link) {
    text-transform: uppercase;
  }

  button {
    text-transform: uppercase;
    padding: calc(var(--space-3) - var(--space-2)) var(--space-3) 0;
  }

  .handheld-row {
    line-height: 1;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: opacity 0.3s;
  }

  @supports (mix-blend-mode: difference) {
    header {
      color: white;
      mix-blend-mode: difference;
    }
    nav.row {
      border-bottom: 1px solid white;
    }
    :global(#contact-link::after) {
      background-color: white;
    }
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    nav.row {
      position: absolute;
      z-index: 10;
      left: var(--space-3);
      top: var(--space-1);
      right: var(--space-2);
      padding: 0;
      border: none;
    }

    .handheld-row {
      display: none;
    }

    .row {
      padding: 0;
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    nav.row {
      left: var(--space-4);
      top: calc(var(--space-2) + var(--space-1));
      right: calc(var(--space-4) - var(--space-1));
    }
  }
  /* Desktop 2560px*/
  @media only screen and (min-width: 160em) {
    header {
      font-size: var(--font-4);
    }
    nav.row {
      left: var(--space-6);
      top: calc(var(--space-3) + var(--space-2));
      right: calc(var(--space-6) - var(--space-2));
    }
  }
</style>
