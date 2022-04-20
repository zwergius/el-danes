<script>
  import Anchor from '$lib/components/Anchor.svelte'
  export let lang
</script>

<ul>
  <li>
    <!-- TODO cannot use sveltekit:prefetch as it triggers language change on hover-->
    <Anchor
      aria-current={lang === 'en' ? 'language' : undefined}
      class="language-switch"
      href="/en"
      target="_self"
    >
      EN
    </Anchor>
  </li>
  <li>
    <Anchor
      aria-current={lang === 'es' ? 'language' : undefined}
      class="language-switch"
      href="/es"
      target="_self"
    >
      SP
    </Anchor>
  </li>
  <li>
    <Anchor
      aria-current={lang === 'da' ? 'language' : undefined}
      class="language-switch"
      href="/da"
      target="_self"
    >
      DA
    </Anchor>
  </li>
</ul>

<style>
  ul {
    display: flex;
    text-transform: uppercase;
  }

  li {
    display: flex;
    align-items: center;
  }

  li:not(:last-child):after {
    content: '/';
    padding: 0 var(--space-1);
    transition: color 0.5s ease;
  }

  :global(a[aria-current]) {
    position: relative;
  }

  :global(a[aria-current]::before) {
    position: absolute;
    top: -1em;
    left: 0;
    right: 0;
    margin: auto;
    content: '\25CF';
    font-size: 0.2em;
    display: flex;
    justify-content: center;
  }

  @supports (mix-blend-mode: difference) {
    :global(li > a.language-switch::after) {
      background-color: white;
    }
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    li:not(:last-child):after {
      padding: 0 var(--space-2);
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    li:not(:last-child):after {
      padding: 0 var(--space-3);
    }
  }
</style>
