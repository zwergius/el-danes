<script>
  import { onMount } from 'svelte'

  export let data
  let Prism

  onMount(async () => {
    const module = await import('svelte-prism')
    Prism = module.default
  })
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/themes/prism-okaidia.min.css" />
</svelte:head>

<svelte:component this="{Prism}" language="html" source="{data}" />
