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
      class="language-switch"
      href="/en"
      rel="prefetch"
      target="_self"
      on:click="{() => handleClick('en')}">
      EN
    </Anchor>
  </li>
  <li>
    <Anchor
      aria-current="{segment === 'es' ? 'language' : undefined}"
      class="language-switch"
      href="/es"
      rel="prefetch"
      target="_self"
      on:click="{() => handleClick('es')}">
      SP
    </Anchor>
  </li>
  <li>
    <Anchor
      aria-current="{segment === 'da' ? 'language' : undefined}"
      class="language-switch"
      href="/da"
      rel="prefetch"
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
