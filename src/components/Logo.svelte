<script>
  import logo from '@/assets/el-danes-logo.svg'
  import bgLogo from '@/assets/el-danes-solutions-logo.svg'
  export let lang, turn
</script>

<div class="logo-container" class:turn>
  <slot />
  <a href="/{lang}">
    <img
      width="1197.07"
      height="296.6"
      class="main-logo"
      src="data:image/svg+xml;utf8,{logo}"
      alt="El Danés logo"
    />
    <img
      width="3924.39"
      height="427.05"
      class="secondary-logo"
      src="data:image/svg+xml;utf8,{bgLogo}"
      alt="El Danés Solutions logo"
    />
    <img
      width="3924.39"
      height="427.05"
      class="secondary-logo two"
      src="data:image/svg+xml;utf8,{bgLogo}"
      alt="El Danés Solutions logo"
    />
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
    -webkit-backface-visibility: visible;
  }

  .main-logo {
    height: auto;
    width: 100%;
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

  a:hover .secondary-logo {
    opacity: 1;
    animation-play-state: running;
  }

  img {
    display: block;
  }

  .secondary-logo {
    opacity: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 77%;
    width: auto;
    transform: translate3d(0, 0, 0);
    animation: marquee 20s linear infinite;
    animation-play-state: paused;
  }

  .secondary-logo.two {
    margin-left: 2em;
    animation: marqueeTwo 20s linear infinite;
    animation-play-state: paused;
  }

  .turn {
    transform: rotate3d(0, 1, 0, -180deg);
  }

  @keyframes marquee {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(calc(-100% - 2em), 0, 0);
    }
  }

  @keyframes marqueeTwo {
    from {
      transform: translate3d(calc(100% + 2em), 0, 0);
    }
    to {
      transform: translate3d(-2em, 0, 0);
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
