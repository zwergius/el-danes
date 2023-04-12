<script lang="ts">
  import { LL } from '$i18n/i18n-svelte'
  import { pageHeader } from '$lib/stores'
  import Anchor from '$lib/components/Anchor.svelte'
  import SEO from '$lib/components/SEO.svelte'
  import type { PageData } from './$types'

  /** @type {import('./$types').PageData */
  export let data: PageData
  let { code, phoneNo, email } = data
  $: ({ code, phoneNo, email } = data)

  $pageHeader = $LL.letsTalk()

  function handleEmail(e: Event) {
    e.preventDefault()
    window.location.href = `mailto:${email}?subject=${$LL.mailToSubject()}`
  }
</script>

<SEO title={$LL.contact()} />

<section>
  <ul>
    <li>
      <Anchor onClick={handleEmail}>{email}</Anchor>
    </li>
    <li>
      <Anchor id="telephone-link" href={`tel:${phoneNo}`} target="_self">
        {phoneNo}
      </Anchor>
    </li>
  </ul>
  <ul>
    <li>
      <Anchor
        href="https://www.instagram.com/el.danes/"
        rel="external noopener"
        target="_blank">instagram</Anchor
      >
    </li>
    <li>
      <Anchor
        href="https://github.com/zwergius"
        rel="external noopener"
        target="_blank">github</Anchor
      >
    </li>
    <li>
      <Anchor
        href="https://www.linkedin.com/in/christian-zwergius"
        rel="external noopener"
        target="_blank">linkedin</Anchor
      >
    </li>
    <li>
      <Anchor
        href="https://www.behance.net/christizwergiu"
        rel="external noopener"
        target="_blank">behance</Anchor
      >
    </li>
  </ul>
</section>

<style>
  ul {
    margin-bottom: var(--space-5);
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
  }
</style>
