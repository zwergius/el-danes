<script>
  export let segment
</script>

<div>
  <button aria-selected="true" aria-label="Use dark theme"></button>
  <button></button>
</div>

<style>
  div {
    display: flex;
    align-items: center;
  }

  button {
    border: 2px solid var(--text);
    border-radius: 50%;
    height: 40px;
    width: 40px;
    background: var(--text);
    margin-left: var(--space-4);
  }

  [aria-selected]::before {
    position: absolute;
    top: -15px;
    left: 0;
    right: 0;
    margin: auto;
    content: '\25CF';
    color: var(--text);
    font-size: 6px;
  }

  [aria-selected] {
    position: relative;
    background: var(--background);
    border: 2px solid var(--text);
  }
</style>
