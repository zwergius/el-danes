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

  function handleEmail() {
    window.location.href = `mailto:${email}`
  }
</script>

<SEO title="{$_('contact')}" />

<section>
  <button on:click="{handleEmail}">hi@eldan&eacute;s.com</button>
  <Anchor id="telephone-link" href="{`tel:${phoneNo}`}" target="_self">
    {phoneNo}
  </Anchor>
  <Anchor href="" rel="external" target="_blank">instagram</Anchor>
  <Anchor href="" rel="external" target="_blank">behance</Anchor>
  <Anchor
    href="https://www.linkedin.com/in/christian-zwergius"
    rel="external"
    target="_blank">
    linkedin
  </Anchor>
  <Anchor href="https://github.com/zwergius" rel="external" target="_blank">
    github
  </Anchor>
</section>

<style>
  :global(a#telephone-link) {
    margin-bottom: var(--space-3);
  }

  button {
    padding: 0;
    background: none;
    border: 0;
    cursor: pointer;
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
