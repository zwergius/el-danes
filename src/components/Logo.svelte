<script>
  import { locale } from 'svelte-i18n'
  import logo from '@/assets/el-danes-logo.svg'
  import bgLogo from '@/assets/el-danes-solutions-logo.svg'
  export let turn
</script>

<div class="logo-container" class:turn>
  <a href="/{$locale}">
    <img
      class="main-logo"
      src="data:image/svg+xml;utf8,{logo}"
      alt="El Danés logo" />
    <img
      class="secondary-logo"
      src="data:image/svg+xml;utf8,{bgLogo}"
      alt="El Danés Solutions logo" />
    <img
      class="secondary-logo two"
      src="data:image/svg+xml;utf8,{bgLogo}"
      alt="El Danés Solutions logo" />
  </a>
</div>

<style>
  .logo-container {
    left: var(--space-3);
    top: calc(var(--space-3) + var(--space-1));
    right: var(--space-3);
    transition: transform 0.5s linear;
    transform-style: preserve-3d;
    transform: rotate3d(0, 1, 0, 0deg);
    backface-visibility: visible;
    -webkit-backface-visibility: visible;
  }

  a {
    position: relative;
    display: block;
    transform: translate3d(0, 0, 0);
    outline: none;
  }

  a:hover .main-logo {
    visibility: hidden;
  }

  a:hover .secondary-logo {
    display: block;
  }

  img {
    display: block;
  }

  .secondary-logo {
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 77%;
    width: auto;
    transform: translate3d(0, 0, 0);
    animation: marquee 20s linear infinite;
  }

  .secondary-logo.two {
    margin-left: 2em;
    animation: marqueeTwo 20s linear infinite;
  }

  .turn {
    transform: rotate3d(0, 1, 0, -180deg);
  }

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }

  @keyframes marqueeTwo {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    .logo-container {
      position: fixed;
      left: var(--space-3);
      top: 0;
      right: var(--space-3);
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
