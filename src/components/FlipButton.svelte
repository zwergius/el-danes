<script>
  import reverse from '@/assets/reverse.svg'
  export let toggleFlip

  function handleKeypress(e) {
    const { key } = e
    if (key === `Enter` || key === ` `) toggleFlip()
  }
</script>

<div
  class="button"
  on:click="{toggleFlip}"
  on:keypress="{handleKeypress}"
  role="button"
  tabindex="0"
  aria-selected=""
  aria-label="Show code">

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256.5 262.57">
    <path
      d="M211.2,11.59A87.75,87.75,0,0,1,244.37,43a82,82,0,0,1,12.13,43.7,82.94,82.94,0,0,1-12.13,43.88,87.27,87.27,0,0,1-33.17,31.57,94.56,94.56,0,0,1-46.38,11.59H27.11L107,251.86,96.32,262.57,0,166.25,96.32,69.92,107,80.62,27.11,158.75H164.82q21.41,0,38.35-9.27a68.33,68.33,0,0,0,26.58-25.69q9.63-16.4,9.63-37.1t-9.63-36.93a68.87,68.87,0,0,0-26.58-25.51Q186.22,15,164.82,15H11.42V0h153.4A94.67,94.67,0,0,1,211.2,11.59Z"></path>
  </svg>
</div>

<style>
  .button {
    display: flex;
    padding: 0 var(--space-3);
    cursor: pointer;
    outline: none;
    margin-top: 0.4em;
  }

  .button svg {
    height: 1.1em;
    width: 1.1em;
    fill: var(--text);
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
  }
</style>
