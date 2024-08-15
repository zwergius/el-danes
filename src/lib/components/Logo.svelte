<script>
  import logo from '$lib/assets/el-danes-logo.svg'
  import bgLogo from '$lib/assets/el-danes-solutions-logo.svg'
  export let lang, turn
</script>

<div class="logo-container" class:turn>
  <slot />
  <a href="/{lang}">
    <img class="main-logo" src={logo} alt="El Danés logo" />
    <div class="wrapper">
      <div class="marquee">
        <img src={bgLogo} alt="GG" />
        <img src={bgLogo} alt="GG" />
      </div>
    </div>
  </a>
</div>

<style>
  .logo-container {
    position: relative;
    padding: var(--space-3) var(--space-3) 0;
    transition: transform 0.5s linear;
    transform-style: preserve-3d;
    transform: rotate3d(0, 1, 0, 0deg);
    backface-visibility: visible;
  }

  a {
    position: relative;
    display: block;
    transform: translate3d(0, 0, 0);
    outline: none;
  }

  a:hover .main-logo {
    opacity: 0;
  }

  a:hover .marquee img {
    opacity: 1;
    animation-play-state: running;
  }

  .main-logo {
    height: auto;
    width: 100%;
  }

  .wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 77%;
  }

  .marquee {
    --gap: 1rem;
    display: flex;
    gap: var(--gap);
    height: 100%;
  }

  .marquee img {
    opacity: 0;
    max-width: unset;
    height: 100%;
    width: auto;
    animation: scroll 20s linear infinite;
    animation-play-state: paused;
  }

  .turn {
    transform: rotate3d(0, 1, 0, -180deg);
  }

  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - var(--gap)));
    }
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    .logo-container {
      position: fixed;
      left: var(--space-3);
      top: 0;
      right: var(--space-3);
      padding: 0;
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    .logo-container {
      left: var(--space-4);
      right: var(--space-4);
    }
  }
  /* Desktop 2560px*/
  @media only screen and (min-width: 160em) {
    .logo-container {
      left: var(--space-6);
      right: var(--space-6);
    }
  }
</style>
