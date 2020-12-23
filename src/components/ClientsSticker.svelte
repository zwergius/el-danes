<script>
  import Anchor from 'components/Anchor.svelte'

  let windowHeight
</script>

<svelte:window bind:innerHeight={windowHeight} />

{#if windowHeight}
  <div style="--y-pos: {(windowHeight / 1.35).toFixed(2)}px">
    <Anchor id="clients-link" rel="prefetch" href="/cases">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 311.98 129.1">
        <ellipse class="cls-1" cx="155.99" cy="64.55" rx="154.99" ry="63.55" />
        <path
          d="M59.65,53.53a20.24,20.24,0,0,1,3.65-5A16.71,16.71,0,0,1,68.86,45a19.83,19.83,0,0,1,7.58-1.38c6.18,0,10.56,2.08,13.42,5A17.08,17.08,0,0,1,94,54.9a18.24,18.24,0,0,1,1.37,5.78H89.05A11.67,11.67,0,0,0,76.81,49a13.17,13.17,0,0,0-9.55,4c-2.47,2.58-4,6.68-4,11.6s1.6,8.81,4.1,11.37A13.63,13.63,0,0,0,77,79.89,12.41,12.41,0,0,0,85.45,77a10.92,10.92,0,0,0,3.6-8h6.31a16.8,16.8,0,0,1-2.72,8.34,17.21,17.21,0,0,1-3.4,4c-2.69,2.28-7.18,4-12.49,4a20.89,20.89,0,0,1-7.64-1.35,17.19,17.19,0,0,1-5.67-3.51,20.66,20.66,0,0,1-3.7-4.94A22.14,22.14,0,0,1,57,64.59,23.55,23.55,0,0,1,59.65,53.53Z" />
        <path
          d="M98.87,84.55l15.52-40.26h9.49l15.58,40.26H133l-4.13-10.7H109.45l-4.15,10.7Zm12.63-16h15.25l-7.59-19.68Z" />
        <path
          d="M149.09,68.85c0,4.05,1.4,7.16,3.62,8.85a12.34,12.34,0,0,0,7.66,2.47c4.92.08,9.69-2.27,9.66-6.32a4.38,4.38,0,0,0-2.27-4,14.61,14.61,0,0,0-3.71-1.62c-.87-.26-1.66-.48-2.36-.65s-1.6-.42-2.69-.67l-3.62-.85c-.82-.19-1.94-.53-3.37-1a14.5,14.5,0,0,1-3.29-1.43,29,29,0,0,1-2.47-1.88,7.67,7.67,0,0,1-2.44-6.12,11.24,11.24,0,0,1,3.73-8.34c2.47-2.28,6.54-3.74,11.57-3.74,4.46,0,8.14,1.24,10.53,3.15,3.7,3,5.28,7.41,5.28,12H168.6c0-6.54-3.23-10-9.32-10a10.7,10.7,0,0,0-6.71,1.91,5.68,5.68,0,0,0-2.45,4.66A4.2,4.2,0,0,0,152,58.55a10.33,10.33,0,0,0,2.3,1.1c1,.36,1.91.64,2.72.84s1.94.48,3.37.78c1.72.37,2.89.68,4.69,1.21a27.2,27.2,0,0,1,4.72,1.83c3.73,1.85,6.54,4.66,6.57,9.15a10.21,10.21,0,0,1-4.41,8.45q-4.38,3.33-11.57,3.34c-5.47,0-9.77-1.46-12.91-4.41s-4.69-6.93-4.69-12Z" />
        <path
          d="M183.86,84.55V44.29h30.19v5.36H190.21V61.27h23v5.34h-23v12.6h23.84v5.34Z" />
        <path
          d="M227.94,68.85c0,4.05,1.4,7.16,3.62,8.85a12.34,12.34,0,0,0,7.66,2.47c4.92.08,9.69-2.27,9.66-6.32a4.38,4.38,0,0,0-2.27-4,14.61,14.61,0,0,0-3.71-1.62c-.87-.26-1.65-.48-2.36-.65s-1.6-.42-2.69-.67l-3.62-.85c-.82-.19-1.94-.53-3.37-1a14.5,14.5,0,0,1-3.29-1.43,30.65,30.65,0,0,1-2.47-1.88,7.67,7.67,0,0,1-2.44-6.12,11.24,11.24,0,0,1,3.73-8.34c2.47-2.28,6.54-3.74,11.57-3.74,4.46,0,8.14,1.24,10.53,3.15,3.7,3,5.28,7.41,5.28,12h-6.32c0-6.54-3.23-10-9.32-10a10.7,10.7,0,0,0-6.71,1.91A5.67,5.67,0,0,0,229,55.24a4.19,4.19,0,0,0,1.85,3.31,10.33,10.33,0,0,0,2.3,1.1c1,.36,1.91.64,2.72.84s1.94.48,3.37.78c1.72.37,2.9.68,4.69,1.21a27.2,27.2,0,0,1,4.72,1.83c3.73,1.85,6.54,4.66,6.57,9.15a10.21,10.21,0,0,1-4.41,8.45q-4.38,3.33-11.57,3.34c-5.47,0-9.77-1.46-12.91-4.41s-4.69-6.93-4.69-12Z" /></svg>
    </Anchor>
  </div>
{/if}

<style>
  div {
    position: fixed;
    top: 0;
    z-index: 1;
    right: var(--space-3);
    transform: translate3d(0, var(--y-pos), 0) rotate(-11deg);
    transition: transform 0.5s ease-out;
  }

  div:hover {
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

  svg {
    fill: var(--background);
    stroke: var(--text);
    stroke-width: 2px;
    width: calc(13em + 1vh + 1vw);
    transition: all 0.5s linear;
  }

  path {
    fill: var(--text);
    transition: all 0.5s linear;
    stroke-width: 0;
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
      right: var(--space-4);
    }
  }
  /* Desktop 2560px*/
  @media only screen and (min-width: 160em) {
    div {
      right: var(--space-6);
      /* TODO check padding */
    }
  }
</style>
