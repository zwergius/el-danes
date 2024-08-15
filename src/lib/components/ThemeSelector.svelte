<script lang="ts">
  import { theme } from '$lib/stores'

  function changeColors(colorMode: string) {
    const theme = {
      dark: [
        { name: '--text', value: 'white' },
        { name: '--background', value: 'black' },
        { name: '--overlay', value: 'rgb(0, 0, 0, 0.8)' },
      ],
      light: [
        { name: '--text', value: 'black' },
        { name: '--background', value: 'white' },
        { name: '--overlay', value: 'rgb(255, 255, 255, 0.8)' },
      ],
    }
    const root = document.documentElement

    theme[colorMode].forEach(({ name, value }) => {
      root.style.setProperty(name, value)
    })
    root.style.setProperty('--color-mode', colorMode)
  }

  function setColorMode(newValue: string) {
    $theme = newValue
    window.localStorage.setItem('color-mode', newValue)
    changeColors(newValue)
  }

  function handleKeypress(e: KeyboardEvent, colorMode: string) {
    const { key } = e
    if (key === `Enter` || key === ` `) setColorMode(colorMode)
  }
</script>

<button
  on:click={() => setColorMode('dark')}
  on:keypress={(e) => handleKeypress(e, 'dark')}
  role="radio"
  aria-checked={$theme === 'dark' ? true : undefined}
  aria-label="Use dark theme"
>
  <div />
</button>
<button
  on:click={() => setColorMode('light')}
  on:keypress={(e) => handleKeypress(e, 'light')}
  role="radio"
  aria-checked={$theme === 'light' ? true : undefined}
  aria-label="Use light theme"
>
  <div />
</button>

<style>
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

  button[aria-checked] div::before {
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

  button[aria-checked] div {
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
