<script lang="ts">
  import { theme } from '$lib/stores'
  import { themeConfig } from '$lib/constants'

  function changeColors(colorMode: string) {
    const root = document.documentElement

    themeConfig[colorMode].forEach(({ name, value }) => {
      root.style.setProperty(name, value)
    })
    root.style.setProperty('--color-mode', colorMode)
  }

  function setColorMode(newValue: string) {
    $theme = newValue
    window.localStorage.setItem('color-mode', newValue)
    changeColors(newValue)
  }
</script>

<div class="theme-selector" role="radiogroup" aria-label="Theme">
  <button
    type="button"
    on:click={() => setColorMode('dark')}
    role="radio"
    aria-checked={$theme === 'dark'}
    aria-label="Use dark theme"
  >
    <div />
  </button>
  <button
    type="button"
    on:click={() => setColorMode('light')}
    role="radio"
    aria-checked={$theme === 'light'}
    aria-label="Use light theme"
  >
    <div />
  </button>
</div>

<style>
  .theme-selector {
    display: flex;
  }

  button {
    padding: var(--space-2);
    cursor: pointer;
    outline: none;
  }

  button div {
    background: var(--text);
    height: 1em;
    width: 1em;
    border: 1px solid var(--text);
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  button[aria-checked='true'] div::before {
    position: absolute;
    top: -2.5em;
    left: 0;
    right: 0;
    margin: auto;
    content: '\25CF';
    font-size: 0.2em;
    display: flex;
    justify-content: center;
  }

  button[aria-checked='true'] div {
    position: relative;
    background: none;
    pointer-events: none;
  }

  @supports (mix-blend-mode: difference) {
    button div {
      border: 1px solid white;
      background: white;
    }
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    button div {
      height: 0.75em;
      width: 0.75em;
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
  }
</style>
