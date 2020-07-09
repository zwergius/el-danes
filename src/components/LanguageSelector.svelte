<script>
  export let segment
  import { locale } from 'svelte-i18n'

  function handleClick(language) {
    locale.set(language)
  }
</script>

<nav>
  <ul>
    <li>
      <a
        aria-current="{segment === 'en' ? 'language' : undefined}"
        href="/en"
        on:click="{() => handleClick('en')}">
        EN
      </a>
    </li>
    <li>
      <a
        aria-current="{segment === 'es' ? 'language' : undefined}"
        href="/es"
        on:click="{() => handleClick('es')}">
        SP
      </a>
    </li>
    <li>
      <a
        aria-current="{segment === 'da' ? 'language' : undefined}"
        href="/da"
        on:click="{() => handleClick('da')}">
        DA
      </a>
    </li>
  </ul>
</nav>

<style>
  ul {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
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

  [aria-current] {
    pointer-events: none;
  }

  [aria-current]::after {
    /* 
    display: block;
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255, 62, 0);
    bottom: -1px; */
  }

  a {
    text-decoration: none;
    display: block;
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
