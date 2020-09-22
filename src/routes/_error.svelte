<script>
  export let status
  export let error

  const dev = process.env.NODE_ENV === 'development'
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div>
  <h1>{status}</h1>
  <p>{error.message}</p>
</div>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}

<style>
  div {
    margin: auto;
    text-align: center;
  }
  h1 {
    font-size: var(--font-10);
    font-weight: 700;
  }

  p {
    font-size: var(--font-2);
    margin: 1em auto;
  }
</style>
