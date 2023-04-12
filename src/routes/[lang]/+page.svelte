<script lang="ts">
  import LL from '$i18n/i18n-svelte'
  import { pageHeader } from '$lib/stores'
  import SEO from '$lib/components/SEO.svelte'
  import Anchor from '$lib/components/Anchor.svelte'
  import type { PageData } from './$types'

  /** @type {import('./$types').PageData */
  export let data: PageData
  let { code, email } = data
  $: ({ code, email } = data)

  $pageHeader = $LL.home.header()

  function handleEmail(e: Event) {
    e.preventDefault()
    window.location.href = `mailto:${email}?subject=${$LL.mailToSubject()}`
  }
</script>

<SEO />

<div>
  <section>
    <p>{$LL.home.section1()}</p>
  </section>

  <section>
    <p>{$LL.home.section2()}</p>

    <ul>
      <li>{$LL.home.section2item1()}</li>
      <li>{$LL.home.section2item2()}</li>
    </ul>
  </section>

  <section>
    <p>{$LL.home.section3()}</p>
  </section>

  <blockquote>
    <span>&#8220;{$LL.home.quote()}&#8221;</span>
    <cite>&#8213; {$LL.home.author()}</cite>
  </blockquote>

  <section>
    <p>{$LL.home.section4()}</p>

    <ul>
      <li>{$LL.home.section4item1()}</li>
      <li>{$LL.home.section4item2()}</li>
    </ul>

    <p>{$LL.home.section5()}</p>
  </section>

  <section>
    <p>{$LL.home.section6()}</p>
  </section>

  <section>
    <Anchor class="call-to-action" onClick={handleEmail}>
      &#8594;{$LL.home.callToAction()}
    </Anchor>
  </section>
</div>

<style>
  div {
    overflow-wrap: break-word;
  }

  section {
    margin-bottom: var(--space-4);
  }

  ul {
    margin: var(--space-3) 0;
    margin-left: var(--space-4);
    list-style: disc;
  }

  li {
    margin-bottom: var(--space-3);
  }

  blockquote {
    position: relative;
    margin-bottom: var(--space-4);
  }

  cite {
    font-size: inherit;
    display: block;
  }

  blockquote > span {
    margin-left: var(--space-1);
  }

  blockquote:hover span {
    opacity: 0;
  }

  blockquote:hover cite {
    opacity: 1;
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

    cite {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }

    blockquote {
      margin-bottom: var(--space-5);
    }

    ul {
      margin-left: var(--space-6);
      margin-bottom: var(--space-5);
    }
  }
  /* Desktop 2560px*/
  @media only screen and (min-width: 160em) {
    ul {
      margin-left: var(--space-7);
    }
  }
</style>
