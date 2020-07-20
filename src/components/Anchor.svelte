<script>
  import { locale } from 'svelte-i18n'
  export let href,
    target = null

  $: path = target ? href : `${$locale}${href}`
</script>

<a href="{path}" {target} {...$$restProps}>
  <slot />
</a>

<style>
  a {
    display: block;
    color: var(--text);
    text-decoration: none;
  }
</style>
