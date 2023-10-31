<script lang="ts">
  import { LL } from '$i18n/i18n-svelte'
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { theme } from '$lib/stores'
  import Anchor from '$lib/components/Anchor.svelte'
  import Logo from '$lib/components/Logo.svelte'
  import LanguageSelector from '$lib/components/LanguageSelector.svelte'
  import ThemeSelector from '$lib/components/ThemeSelector.svelte'
  import FlipButton from '$lib/components/FlipButton.svelte'

  export let lang: string
  export let toggleFlip: () => void
  export let showsCode: boolean

  let showsNavigation: boolean
  // let height: number

  onMount(() => {
    showsNavigation = window.matchMedia(
      'only screen and (min-width: 48em)'
    ).matches
  })

  function toggleShowsNavigation() {
    showsNavigation = !showsNavigation
  }
</script>

<header>
  {#if showsNavigation}
    <nav class="row {$theme && 'visible'}" transition:slide>
      <LanguageSelector {lang} />
      <Anchor id="contact-link" data-testid="contact" href="/contact">
        {$LL.contact()}
      </Anchor>
      <div class="row">
        <FlipButton {toggleFlip} flipped={showsCode} />
        <ThemeSelector />
      </div>
    </nav>
  {/if}
  <Logo {lang} turn={showsCode}>
    <div class="handheld-row">
      <button
        data-testid="showMenu"
        on:click={toggleShowsNavigation}
        type="button"
      >
        {showsNavigation ? $LL.back() : $LL.menu()}
      </button>
    </div>
  </Logo>
</header>

<style>
  header {
    position: fixed;
    z-index: 5;
    left: 0;
    top: 0;
    right: 0;
    height: var(--header-height);
    font-size: var(--font-3);
    color: var(--text);
    transform: translate3d(0, 0, 0);
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
