<script context="module">
  export async function preload(_, session) {
    const { email, phoneNo } = session
    const res = await this.fetch('contact.json')
    if (res.status === 200) {
      const data = await res.json()
      return { data, email, phoneNo }
    }
    return { email, phoneNo }
  }
</script>

<script>
  import { _ } from 'svelte-i18n'
  import { pageCode } from '@/stores.js'
  import Anchor from '@/components/Anchor.svelte'
  import SEO from '@/components/SEO.svelte'

  export let data, email, phoneNo

  $pageCode = atob(data.content)

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
      <Anchor
        href="https://www.instagram.com/el.danes/"
        rel="external noopener"
        target="_blank">
        instagram
      </Anchor>
    </li>
    <li>
      <Anchor
        href="https://github.com/zwergius"
        rel="external noopener"
        target="_blank">
        github
      </Anchor>

    </li>
    <li>
      <Anchor
        href="https://www.linkedin.com/in/christian-zwergius"
        rel="external noopener"
        target="_blank">
        linkedin
      </Anchor>
    </li>
    <li>
      <Anchor
        href="https://www.behance.net/christizwergiu"
        rel="external noopener"
        target="_blank">
        behance
      </Anchor>
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
