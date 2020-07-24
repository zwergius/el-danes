<script context="module">
  export async function preload(_, session) {
    const { email, phoneNo } = session
    return { email, phoneNo }
  }
</script>

<script>
  import { _ } from 'svelte-i18n'
  import Anchor from '@/components/Anchor.svelte'
  import SEO from '@/components/SEO.svelte'

  export let email, phoneNo

  function handleEmail(e) {
    e.preventDefault()
    window.location.href = `mailto:${email}`
  }
</script>

<SEO title="{$_('contact')}" />

<section>
  <ul>
    <li>
      <Anchor on:click="{handleEmail}">{email}</Anchor>
    </li>
    <li>
      <Anchor id="telephone-link" href="{`tel:${phoneNo}`}" target="_self">
        {phoneNo}
      </Anchor>
    </li>
  </ul>
  <ul>
    <li>
      <Anchor href="" rel="external" target="_blank">instagram</Anchor>
    </li>
    <li>
      <Anchor href="https://github.com/zwergius" rel="external" target="_blank">
        github
      </Anchor>

    </li>
    <li>
      <Anchor
        href="https://www.linkedin.com/in/christian-zwergius"
        rel="external"
        target="_blank">
        linkedin
      </Anchor>
    </li>
    <li>
      <Anchor href="" rel="external" target="_blank">behance</Anchor>
    </li>
  </ul>
</section>

<style>
  ul {
    margin-bottom: var(--space-3);
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    :global(a#telephone-link) {
      margin-bottom: var(--space-5);
    }
  }
</style>
