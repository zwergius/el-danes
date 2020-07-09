<script>
  import { theme } from '@/stores.js'

  function changeColors(colorMode) {
    const theme = {
      dark: [
        { name: '--text', value: 'white' },
        { name: '--background', value: 'black' },
      ],
      light: [
        { name: '--text', value: 'black' },
        { name: '--background', value: 'white' },
      ],
    }
    const root = document.documentElement

    theme[colorMode].forEach(({ name, value }) => {
      root.style.setProperty(name, value)
    })
    root.style.setProperty('--color-mode', colorMode)
  }

  function setColorMode(newValue) {
    $theme = newValue
    window.localStorage.setItem('color-mode', newValue)
    changeColors(newValue)
  }

  function handleKeypress(e, colorMode) {
    const { key } = e
    if (key === `Enter` || key === ` `) setColorMode(colorMode)
  }
</script>

<div>
  <div
    class="button"
    on:click="{() => setColorMode('dark')}"
    on:keypress="{(e) => handleKeypress(e, 'dark')}"
    tabIndex="0"
    role="button"
    aria-selected="{$theme === 'dark' ? true : undefined}"
    aria-label="Use dark theme">
    <div></div>
  </div>
  <div
    class="button"
    on:click="{() => setColorMode('light')}"
    on:keypress="{(e) => handleKeypress(e, 'light')}"
    tabIndex="0"
    role="button"
    aria-selected="{$theme === 'light' ? true : undefined}"
    aria-label="Use light theme">
    <div></div>
  </div>
</div>

<style>
  div {
    display: flex;
  }

  .button {
    padding: var(--space-2);
    cursor: pointer;
    outline: none;
  }

  .button div {
    background: var(--text);
    height: 1em;
    width: 1em;
    border: 1px solid var(--text);
    border-radius: 50%;
  }

  [aria-selected] div::before {
    position: absolute;
    top: -2.5em;
    left: 0;
    right: 0;
    margin: auto;
    content: '\25CF';
    color: var(--text);
    font-size: 0.2em;
    display: flex;
    justify-content: center;
  }

  [aria-selected] div {
    position: relative;
    background: var(--background);
    border: 1px solid var(--text);
    pointer-events: none;
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    .button div {
      height: 0.75em;
      width: 0.75em;
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    button {
      margin-left: var(--space-4);
      height: 40px;
      width: 40px;
    }
  }
</style>
