<script>
  import { locale } from 'svelte-i18n'
  export let href = null,
    target = null

  $: path = target ? href : `${$locale}${href}`
</script>

{#if href}
  <a href="{path}" {target} {...$$restProps}>
    <slot />
  </a>
{:else}
  <button type="button" {...$$restProps}>
    <slot />
  </button>
{/if}

<style>
  a,
  button {
    display: inline-block;
    color: var(--text);
    text-decoration: none;
    transition: all 0.275s ease-in-out;
    position: relative;
    text-shadow: 2px 2px var(--background), 2px -2px var(--background),
      -2px 2px var(--background), -2px -2px var(--background);
  }

  a::after,
  button::after {
    content: '';
    position: absolute;
    z-index: -1;
    bottom: 0.15em;
    height: 0.05em;
    margin: 5px 0 0;
    transition: all 0.2s ease-in-out;
    min-height: 2px;
    background-color: var(--text);
    left: 0;
    cursor: pointer;
    width: 0;
    border-radius: 4px;
  }

  a:hover::after,
  button:hover::after {
    width: 100%;
  }
</style>
