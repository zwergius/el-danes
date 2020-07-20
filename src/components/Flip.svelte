<script>
  export let isFlipped
</script>

<div class="scene">
  <div class:isFlipped class="flipper">
    <div class="front">
      <slot name="front" />
    </div>
    <div class="back">
      <slot name="back" />
    </div>
  </div>
</div>

<style>
  .scene {
    perspective: 1000px;
  }

  .flipper {
    position: relative;
    transition: transform 1s;
    transform-style: preserve-3d;
  }

  .isFlipped {
    transform: rotateY(-180deg);
  }

  .front,
  .back {
    position: absolute;
    backface-visibility: hidden;
  }

  .back {
    transform: rotate(-180deg);
  }
</style>
