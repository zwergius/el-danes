<script>
  let flipped = false

  function turn(node, { delay = 0, duration = 1000 }) {
    return {
      delay,
      duration,
      css: (t, u) => `
				transform: rotateY(${1 - u * 180}deg);
				opacity: ${1 - u};
			`,
    }
  }

  export function flip() {
    flipped = !flipped
  }
</script>

<button on:click="{flip}">whaaaa</button>

<div class="card-container">
  <div class="card">
    {#if !flipped}
      <div class="side" transition:turn>
        <slot name="front" />
      </div>
    {:else}
      <div class="side back" transition:turn>
        <slot name="back" />
      </div>
    {/if}
  </div>
</div>

<style>
  .card-container {
    position: relative;
    height: 100%;
    width: 100%;
    perspective: 1000px;
  }

  .card {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .side {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    backface-visibility: hidden;
  }
</style>
