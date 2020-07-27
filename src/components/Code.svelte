<script>
  import { onMount } from 'svelte'

  export let data
  let Prism

  onMount(async () => {
    const module = await import('svelte-prism')
    Prism = module.default
  })
</script>

<svelte:component this="{Prism}" language="html" source="{data}" />
