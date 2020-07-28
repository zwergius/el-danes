<script>
  import { _ } from 'svelte-i18n'
  import Anchor from '@/components/Anchor.svelte'

  let windowHeight
</script>

<svelte:window bind:innerHeight="{windowHeight}" />

{#if windowHeight}
  <div style="--y-pos: {windowHeight / 2}px">
    <Anchor id="clients-link" href="/clients">{$_('clients')}</Anchor>
  </div>
{/if}

<style>
  div {
    position: fixed;
    top: 0;
    transform: translate3d(0, var(--y-pos), 0) rotate(-11deg);
    right: var(--space-2);
    background: var(--background);
    color: var(--text);
    border: 2px solid var(--text);
    border-radius: 50%;
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-4);
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.5s ease-out;
  }

  div:hover {
    transition: none;
    animation: vibrate 0.2s linear;
  }

  :global(#clients-link::after) {
    display: none;
    background-color: var(--text);
  }

  @keyframes vibrate {
    0% {
      transform: translate3d(0px, var(--y-pos), 0) rotate3d(0, 0, 1, -11deg);
    }
    10% {
      transform: translate3d(-2px, var(--y-pos), 0) rotate3d(0, 0, 1, -13deg);
    }
    20% {
      transform: translate3d(2px, var(--y-pos), 0) rotate3d(0, 0, 1, -9deg);
    }
    30% {
      transform: translate3d(-4px, var(--y-pos), 0) rotate3d(0, 0, 1, -15deg);
    }
    40% {
      transform: translate3d(4px, var(--y-pos), 0) rotate3d(0, 0, 1, -7deg);
    }
    50% {
      transform: translate3d(-4px, var(--y-pos), 0) rotate3d(0, 0, 1, -15deg);
    }
    60% {
      transform: translate3d(4px, var(--y-pos), 0) rotate3d(0, 0, 1, -7deg);
    }
    70% {
      transform: translate3d(-4px, var(--y-pos), 0) rotate3d(0, 0, 1, -15deg);
    }
    80% {
      transform: translate3d(2px, var(--y-pos), 0) rotate3d(0, 0, 1, -9deg);
    }
    90% {
      transform: translate3d(-2px, var(--y-pos), 0) rotate3d(0, 0, 1, -13deg);
    }
    100% {
      transform: translate3d(0px, var(--y-pos), 0) rotate3d(0, 0, 1, -11deg);
    }
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    div {
      right: var(--space-3);
      transition: none;
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    div {
      right: var(--space-5);
      padding: var(--space-3) var(--space-4);
    }
  }
</style>
