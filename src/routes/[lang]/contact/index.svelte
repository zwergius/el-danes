<script context="module">
  export async function preload(page, session) {
    const { lang } = page.params
    const { email, phoneNo } = session
    const res = await this.fetch(`/${lang}/contact.json`)
    if (res.status === 200) {
      const code = await res.json()
      return { code, email, lang, phoneNo }
    }
    this.error(404, `/${lang}/contact.json Not found`)
  }
</script>

<script>
  import { pageCode, pageHeader } from '@/stores'
  import { contact, letsTalk } from 'assets/translations.yaml'
  import Anchor from '@/components/Anchor.svelte'
  import SEO from '@/components/SEO.svelte'

  export let code, email, lang, phoneNo

  $pageHeader = letsTalk[lang]
  $pageCode = code

  function handleEmail(e) {
    e.preventDefault()
    window.location.href = `mailto:${email}`
  }
</script>

<SEO title={contact[lang]} />

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
        target="_blank"
      >instagram</Anchor
      >
    </li>
    <li>
      <Anchor
        href="https://github.com/zwergius"
        rel="external noopener"
        target="_blank"
      >github</Anchor
      >
    </li>
    <li>
      <Anchor
        href="https://www.linkedin.com/in/christian-zwergius"
        rel="external noopener"
        target="_blank"
      >linkedin</Anchor
      >
    </li>
    <li>
      <Anchor
        href="https://www.behance.net/christizwergiu"
        rel="external noopener"
        target="_blank"
      >behance</Anchor
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
