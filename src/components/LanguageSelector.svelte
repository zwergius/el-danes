<script>
  export let segment
</script>

<nav>
  <ul>
    <li>
      <a aria-current="{segment === undefined ? 'page' : undefined}" href=".">
        EN
      </a>
    </li>
    <li>
      <a aria-current="{segment === 'about' ? 'page' : undefined}" href="about">
        SP
      </a>
    </li>
    <li>
      <a aria-current="{segment === 'blog' ? 'page' : undefined}" href="blog">
        DK
      </a>
    </li>
  </ul>
</nav>

<style>
  nav {
    font-size: 48px;
  }

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
    padding: 0 var(--space-3);
  }

  [aria-current] {
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
</style>
