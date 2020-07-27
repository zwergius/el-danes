<script>
  import logo from '@/assets/el-danes-logo.svg'
  export let isFolded
</script>

<div class="container" style="--logo: url('data:image/svg+xml;utf8,{logo}')">
  <div class="wrapper {isFolded && 'active'}">

    <span class="a"></span>
    <span class="bc">
      <span class="b"></span>
      <span class="c"></span>
    </span>

    <div class="img">
      <img src="data:image/svg+xml;utf8,{logo}" alt="El Danés logo" />
    </div>
  </div>
</div>

<style>
  .container {
    position: fixed;
    z-index: 0;
    left: var(--space-2);
    top: calc(var(--space-3) + var(--space-1));
    right: var(--space-2);
  }

  .wrapper {
    position: relative;
    transform-style: preserve-3d;
    perspective: 500px;
  }

  img {
    display: block;
    opacity: 0;
  }

  .wrapper .a,
  .wrapper .b,
  .wrapper .c {
    top: 0;
    display: inline-block;
    height: 100%;
    background-image: var(--logo);
    background-size: cover;
    background-repeat: no-repeat;
  }

  .wrapper .a {
    position: absolute;
    left: 0;
    width: 27%;
    background-position: 0 0;
    z-index: 2;
  }

  .wrapper .bc {
    position: absolute;
    display: inline-flex;
    width: 73%;
    height: 100%;
    left: 27%;
    transform-origin: left;
    transition: transform 1s;
    transform-style: preserve-3d;
  }

  .wrapper .b,
  .wrapper .c {
    position: relative;
    width: 50%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .wrapper .b {
    background-position: 42.5% 0;
    transform-style: preserve-3d;
  }

  .wrapper .b:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    transform: rotateY(180deg) translateZ(0px);
    transform-style: preserve-3d;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .wrapper .c {
    background-position: 100% 0;
    transform-origin: left;
    transition: transform 1s;
  }

  .wrapper.active .bc {
    transform: rotateY(180deg) translateZ(1px);
    transition: transform 1s;
  }

  .wrapper.active .c {
    transform: rotateY(-180deg) translate3d(-5px, 0, -1px);
    transition: transform 1s;
  }

  @supports (mix-blend-mode: difference) {
    .container {
      color: white;
      mix-blend-mode: difference;
    }
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    .container {
      position: fixed;
      left: var(--space-3);
      top: 0;
      right: var(--space-3);
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    .container {
      position: fixed;
      left: var(--space-5);
      top: 0;
      right: var(--space-5);
    }
  }
</style>
