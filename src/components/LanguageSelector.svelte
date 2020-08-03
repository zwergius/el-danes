<script>
  import { locale } from 'svelte-i18n'
  import Anchor from '@/components/Anchor.svelte'
  export let segment

  function handleClick(language) {
    locale.set(language)
  }
</script>

<ul>
  <li>
    <Anchor
      aria-current="{segment === 'en' ? 'language' : undefined}"
      href="/en"
      target="_self"
      on:click="{() => handleClick('en')}">
      EN
    </Anchor>
  </li>
  <li>
    <Anchor
      aria-current="{segment === 'es' ? 'language' : undefined}"
      href="/es"
      target="_self"
      on:click="{() => handleClick('es')}">
      SP
    </Anchor>
  </li>
  <li>
    <Anchor
      aria-current="{segment === 'da' ? 'language' : undefined}"
      href="/da"
      target="_self"
      on:click="{() => handleClick('da')}">
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
