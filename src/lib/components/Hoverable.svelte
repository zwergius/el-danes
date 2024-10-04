<script>
  let hovering

  function enter() {
    hovering = true
  }

  function leave() {
    hovering = false
  }
</script>

<button on:mouseenter={enter} on:mouseleave={leave}>
  <slot {hovering} />
</button>

<style>
  button {
    max-width: 100%;
  }
</style>
