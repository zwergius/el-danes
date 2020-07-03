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
</script>

<div>
  <button
    on:click="{() => setColorMode('dark')}"
    type="button"
    aria-selected="{$theme === 'dark' ? true : undefined}"
    aria-label="Use dark theme"></button>
  <button
    on:click="{() => setColorMode('light')}"
    type="button"
    aria-selected="{$theme === 'light' ? true : undefined}"
    aria-label="Use light theme"></button>
</div>

<style>
  div {
    display: flex;
    align-items: center;
  }

  button {
    border: 1px solid var(--text);
    border-radius: 50%;
    height: 40px;
    width: 40px;
    background: var(--text);
    margin-left: var(--space-4);
    cursor: pointer;
  }

  [aria-selected]::before {
    position: absolute;
    top: -15px;
    left: 0;
    right: 0;
    margin: auto;
    content: '\25CF';
    color: var(--text);
    font-size: 6px; /* TODO add var */
  }

  [aria-selected] {
    position: relative;
    background: var(--background);
    border: 1px solid var(--text);
    pointer-events: none;
  }
</style>
