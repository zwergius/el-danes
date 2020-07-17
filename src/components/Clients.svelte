<script>
  import { _ } from 'svelte-i18n'
  import Anchor from '@/components/Anchor.svelte'
</script>

<Anchor id="clients-link" href="/clients">{$_('clients')}</Anchor>

<style>
  :global(a#clients-link) {
    position: fixed;
    top: 50%;
    transform: translateY(-50%) rotate(-11deg);
    right: var(--space-2);
    background: var(--background);
    color: var(--text);
    border: 1px solid var(--text);
    border-radius: 50%;
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-4);
    text-transform: uppercase;
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    :global(a#clients-link) {
      right: var(--space-3);
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    :global(a#clients-link) {
      right: var(--space-5);
      padding: var(--space-3) var(--space-4);
    }
  }
</style>
