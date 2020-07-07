<script>
  import { _ } from 'svelte-i18n'
</script>

<button>{$_('clients')}</button>

<style>
  button {
    position: fixed;
    top: 50%;
    transform: translateY(-50%) rotate(-11deg);
    right: var(--space-5);
    background: var(--background);
    color: var(--text);
    border: 1px solid var(--text);
    border-radius: 50%;
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-1);
    text-transform: uppercase;
  }
</style>
