<script>
  import { stores } from '@sapper/app'
  const { page } = stores()
  const lang = $page.params.lang
  export let href = null,
    target = null,
    onClick = null

  $: path = target ? href : `${lang}${href}`
</script>

{#if href}
  <a href={path} on:click={onClick} {target} {...$$restProps}>
    <slot />
  </a>
{:else}
  <button type="button" on:click={onClick} {...$$restProps}>
    <slot />
  </button>
{/if}

<style>
  a,
  button {
    display: inline-block;
    transition: all 0.275s ease-in-out;
    position: relative;
    outline: none;
  }

  a::after,
  button::after {
    content: '';
    position: absolute;
    z-index: -1;
    bottom: 0.1em;
    height: 0.06em;
    margin: 5px 0 0;
    transition: all 0.2s ease-in-out;
    min-height: 2px;
    background-color: var(--text);
    left: 0;
    cursor: pointer;
    width: 0;
    border-radius: 4px;
  }

  @media (hover: hover) {
    a:hover::after,
    button:hover::after {
      width: 100%;
    }
  }
  /*
  @supports (mix-blend-mode: difference) {
    a::after,
    button::after {
      background-color: white;
    }
  }*/
</style>
