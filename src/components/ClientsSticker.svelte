<script>
  import { _ } from 'svelte-i18n'
  import Anchor from '@/components/Anchor.svelte'

  let windowHeight
</script>

<svelte:window bind:innerHeight="{windowHeight}" />

{#if windowHeight}
  <Anchor
    id="clients-link"
    style="--y-pos: {windowHeight / 1.35}px"
    href="/clients">
    {$_('clients')}
  </Anchor>
{/if}

<style>
  :global(#clients-link) {
    position: fixed;
    top: 0;
    right: var(--space-3);
    padding: var(--space-3) calc(var(--space-3) + var(--space-2));
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--background);
    border: 2px solid var(--text);
    border-radius: 50%;
    color: var(--text);
    font-family: La Nord Regular;
    font-size: var(--font-5);
    text-transform: uppercase;
    transform: translate3d(0, var(--y-pos), 0) rotate(-11deg);
    transition: transform 0.5s ease-out;
  }

  :global(#clients-link:hover) {
    transition: none;
    animation-name: vibrate, vibrate;
    animation-duration: 0.25s;
    animation-delay: 0s, 1s;
    animation-timing-function: ease-in, ease-out;
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
    :global(#clients-link) {
      right: var(--space-3);
      transition: none;
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    :global(#clients-link) {
      right: var(--space-4);
      padding: var(--space-3) var(--space-4);
    }
  }
  /* Desktop 2560px*/
  @media only screen and (min-width: 160em) {
    :global(#clients-link) {
      right: var(--space-6);
      /* TODO check padding */
    }
  }
</style>
