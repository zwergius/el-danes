<script lang="ts">
  import LL from '$i18n/i18n-svelte'
  import { pageHeader } from '$lib/stores'
  import SEO from '$lib/components/SEO.svelte'
  import Anchor from '$lib/components/Anchor.svelte'
  import type { PageData } from './$types'

  /** @type {import('./$types').PageData */
  export let data: PageData
  let { email } = data
  $: ({ email } = data)

  $pageHeader = $LL.home.footer()

  function handleEmail(e: Event) {
    e.preventDefault()
    window.location.href = `mailto:${email}?subject=${$LL.mailToSubject()}`
  }
</script>

<SEO />

<section>
  <h1>{$LL.home.header()}</h1>
  <h2>{$LL.home.headerTwo()}</h2>
  <ul>
    {#each Object.values($LL.roles) as { title, subtitle }, index (index)}
      <li>
        <p>{title()}</p>
        <div class="subtitle">
          <p>{@html subtitle()}</p>
        </div>
      </li>
    {/each}
  </ul>
</section>
<div>
  <Anchor class="call-to-action" onClick={handleEmail}>
    &#8594;{$LL.home.callToAction()}
  </Anchor>
</div>

<style>
  .subtitle {
    background-color: var(--overlay);
    font-size: var(--font-2);
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1;
    min-width: 100%;
    color: var(--text);
    opacity: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .subtitle:hover {
    opacity: 1;
  }

  section {
    margin-bottom: var(--space-4);
  }

  ul {
    margin: var(--space-3) 0;
    margin-left: var(--space-4);
    list-style: disclosure-closed;
  }

  li {
    position: relative;
    margin-bottom: var(--space-3);
  }

  :global(button.call-to-action::after) {
    width: 100%;
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    ul {
      margin-left: var(--space-5);
    }
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    section {
      margin-bottom: var(--space-5);
    }

    ul {
      margin-left: var(--space-6);
      margin-bottom: var(--space-5);
    }
  }
  /* Desktop 2560px*/
  @media only screen and (min-width: 160em) {
  }
</style>
