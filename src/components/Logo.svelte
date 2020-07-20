<script>
  import logo from '@/assets/el-danes-logo.svg'
</script>

<div class="container" style="--logo: url('data:image/svg+xml;utf8,{logo}')">
  <div class="wrapper">

    <span class="a"></span>
    <span class="bc">
      <span class="b"></span>
      <span class="c"></span>
    </span>

    <div class="img">
      <img src="data:image/svg+xml;utf8,{logo}" alt="El Danés logo" />
      <!--         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1197.07 296.6">
        <path
          d="M0,165.41V68.82H67.55v7.61H9V112.6H64.79v7.55H9V157.8H67.55v7.61Z"></path>
        <path
          d="M120.4,293.78V68.9h77.84c30.53,0,55.12,8.77,70.78,22.71a86,86,0,0,1,19.42,25.06c10.18,19.57,14.09,40.71,14.09,65.77,0,24.59-3.91,45.57-14.09,64.83A85.9,85.9,0,0,1,269,271.86c-15.66,13.31-40.25,21.92-70.78,21.92Zm20.83-17.69h47.45c34,0,56.22-8,70-21.14,9.56-9.24,14.88-18.95,18.48-32.11s4.54-25.21,4.54-40.4c0-7.83-.31-14.88-.94-21.3-1.25-13-4.85-27.25-10.64-37.74-11.91-21.92-36.18-36.8-81.44-36.8H141.23Z"></path>
        <path
          d="M324.93,293.47,415.76,68.9h32.58l90.82,224.57H517.71l-29.28-72.19H375.67l-29.28,72.19Zm57.79-89.73h98.66l-49.33-122Z"></path>
        <path
          d="M576,293.47V68.9h37.74L737.27,283.6V68.9H758.1V293.47H719L596.8,81.12V293.47Z"></path>
        <path
          d="M819,293.47V68.9H976.1V86.6H839.85v84.09H969.68v17.54H839.85v87.54H976.1v17.7ZM874.15,44.94,924.1,0h33.67L893.41,44.94Z"></path>
        <path
          d="M1043.44,204.05c0,26.78,8.46,47.14,22.08,58.41,13.78,11.28,29.76,16.6,48.39,16.6a90.17,90.17,0,0,0,30.38-5,54.14,54.14,0,0,0,22.87-15.82,38.06,38.06,0,0,0,8.92-25.05c0-6.89-1.09-12.37-4.85-17.23s-6.26-8-13.78-11.59c-3.76-1.88-7-3.44-9.71-4.54a91.2,91.2,0,0,0-12.37-4.23c-5.48-1.72-9.87-3-13.47-3.91l-16-4.07-16-4.07c-4.22-1.26-9.24-2.82-15-4.86a112.19,112.19,0,0,1-14.56-6.11c-7.68-4.22-17.23-10.64-22.24-17.38a46.66,46.66,0,0,1-8.61-27.25c0-16.13,7-31.16,19.57-42.91s33.51-19.26,58.1-19.26c25.21,0,44.94,7,59.35,21.3,14.57,14.25,21.77,34.14,21.77,59.82h-20.83q0-63.42-58.72-63.42c-40.72,0-58.26,23-58.26,43.85a32.41,32.41,0,0,0,3.76,14.72c2,3.91,7.2,8,11,10.65s11.75,5.95,16.76,7.83c2.5.94,6,2,10.49,3.28l11.12,3.14,12.53,3.13,11.58,3c3,.79,6.89,1.88,11.75,3.45s9.08,3,12.37,4.38c3.29,1.26,7.2,3,11.59,5.17a67,67,0,0,1,19.89,14.1c8.92,8.45,13.31,19.26,13.78,33.67a52.41,52.41,0,0,1-11.59,33.35c-15.5,19.42-41.81,29.44-71.88,29.44-47.45.16-91.14-27.25-91.14-92.55Z"></path>
        <path d="M.73,293.88V197.3h9v89H60.6v7.61Z"></path>
      </svg> -->
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
    width: 50%;
    background-position: 0 0;
  }

  .wrapper .bc {
    position: absolute;
    display: inline-flex;
    width: 50%;
    height: 100%;
    left: 50%;
    transform-origin: left;
    transition: transform 3s;
    transform-style: preserve-3d;
  }

  .wrapper .b,
  .wrapper .c {
    position: relative;
    width: 50%;
    backface-visibility: hidden;
  }

  .wrapper .b {
    background-position: 66.666667% 0;
    transform-style: preserve-3d;
  }

  .wrapper .b:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    transform: rotateY(180deg) translateZ(1px);
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  .wrapper .c {
    background-position: 100% 0;
    transform-origin: left;
    transition: transform 2s;
  }

  .wrapper:hover .bc,
  .wrapper:active .bc {
    transform: rotateY(-180deg) translateZ(-1px);
    transition: transform 2s;
  }

  .wrapper:hover .c,
  .wrapper:active .c {
    transform: rotateY(180deg) translateZ(2px);
    transition: transform 3s;
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
