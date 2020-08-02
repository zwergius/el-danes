<script>
  import { _ } from 'svelte-i18n'
  import { fly } from 'svelte/transition'
  import { theme } from '@/stores.js'
  import Anchor from '@/components/Anchor.svelte'
  import Logo from '@/components/Logo.svelte'
  import LanguageSelector from '@/components/LanguageSelector.svelte'
  import ThemeSelector from '@/components/ThemeSelector.svelte'
  import FlipButton from '@/components/FlipButton.svelte'

  export let segment, toggleFlip, showsCode
</script>

<header>
  <Logo turn="{showsCode}" />
  <!-- <div class="handheld-row">
    <button>{$_('menu')}</button>
  </div>-->
  <nav class="row {$theme && 'visible'}">
    <LanguageSelector {segment} />
    <Anchor id="contact-link" href="/contact">{$_('contact')}</Anchor>
    <div class="row {$theme && 'visible'}">
      <FlipButton {toggleFlip} flipped="{showsCode}" />
      <ThemeSelector />
    </div>
  </nav>
</header>

<style>
  header {
    position: fixed;
    z-index: 5;
    left: 0;
    top: 0;
    right: 0;
    font-size: var(--font-3);
    color: var(--text);
    padding: calc(var(--space-3) + var(--space-1)) var(--space-3);
  }

  nav.row {
    position: absolute;
    z-index: 10;
    left: var(--space-3);
    top: var(--space-1);
    right: var(--space-2);
  }

  :global(#contact-link) {
    text-transform: uppercase;
  }

  .handheld-row {
    display: flex;
    justify-content: flex-end;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .visible {
    opacity: 1;
  }

  @supports (mix-blend-mode: difference) {
    header,
    nav.row {
      color: white;
      mix-blend-mode: difference;
    }
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
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
