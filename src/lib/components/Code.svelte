<script>
  import { onMount } from 'svelte'

  export let data
  let Prism

  onMount(async () => {
    try {
      await import('prismjs')
      Prism = (await import('svelte-prism')).default
    } catch (e) {
      console.error('Could not load svelte-prism: ', e)
    }
  })
</script>

<svelte:component this={Prism} language="html" source={data} />
