<script>
  import { _ } from 'svelte-i18n'
</script>

<button>{$_('clients')}</button>

<style>
  button {
    position: fixed;
    top: 50%;
    transform: translateY(-50%) rotate(-11deg);
    right: var(--space-2);
    background: var(--background);
    color: var(--text);
    border: 1px solid var(--text);
    border-radius: 50%;
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-1);
    text-transform: uppercase;
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    button {
      right: var(--space-3);
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    button {
      right: var(--space-5);
      padding: var(--space-3) var(--space-4);
    }
  }
</style>
