<footer>
  <h1>

    <slot />
  </h1>
  <div class="copyright">
    <span>&copy;</span>
    <span class="el-danes">EL DAN&Eacute;S</span>
  </div>
</footer>

<style>
  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    font-size: var(--font-3);
    border-top: 1px solid var(--text);
    padding: var(--space-1) var(--space-3);
  }

  h1 {
    flex: 2 0 auto;
  }

  .copyright {
    display: flex;
    flex: 1;
    justify-content: flex-end;
  }

  .el-danes {
    margin-left: auto;
    white-space: nowrap;
  }

  .el-danes::before {
    content: '\00a0';
  }
  /*
  @supports (mix-blend-mode: difference) {
    footer {
      color: white;
      border-top: 1px solid white;
      mix-blend-mode: difference;
    }
  }
*/
  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    footer {
      padding: var(--space-3) var(--space-3);
      border-width: 2px;
    }
    .copyright {
      flex: unset;
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    footer {
      padding: var(--space-3) var(--space-4);
    }
  }
  /* Desktop 2560px*/
  @media only screen and (min-width: 160em) {
    footer {
      padding: var(--space-3) var(--space-6);
      border-width: 4px;
    }
  }
</style>
