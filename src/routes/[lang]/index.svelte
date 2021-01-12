<script context="module">
  export async function preload(_, session) {
    const { email } = session
    const res = await this.fetch('index.json')
    if (res.status === 200) {
      const data = await res.json()
      return { data, email }
    }
    this.error(404, 'Not found')
  }
</script>

<script>
  import { stores } from '@sapper/app'
  const { page } = stores()
  import { onMount } from 'svelte'
  import { home } from 'assets/translations.yaml'
  import { pageCode, pageHeader } from '@/stores.js'
  import SEO from '@/components/SEO.svelte'
  import Anchor from '@/components/Anchor.svelte'

  export let data, email
  const { lang } = $page.params

  $pageHeader = home.header[lang]

  onMount(() => {
    $pageCode = atob(data.content)
  })

  function handleEmail(e) {
    e.preventDefault()
    window.location.href = `mailto:${email}`
  }
</script>

<SEO />

<div>
  <section>
    <p>{home.section1[lang]}</p>
  </section>

  <section>
    <p>{home.section2[lang]}</p>

    <ul>
      <li>{home.section2.item1[lang]}</li>
      <li>{home.section2.item2[lang]}</li>
    </ul>
  </section>

  <section>
    <p>{home.section3[lang]}</p>
  </section>

  <blockquote>
    <span>&#8220;{home.quote[lang]}&#8221;</span>
    <cite>&#8213; {home.author[lang]}</cite>
  </blockquote>

  <section>
    <p>{home.section4[lang]}</p>

    <ul>
      <li>{home.section4.item1[lang]}</li>
      <li>{home.section4.item2[lang]}</li>
    </ul>

    <p>{home.section5[lang]}</p>
  </section>

  <section>
    <p>
      {home.section6[lang]}
      <Anchor class="call-to-action" onClick={handleEmail}>
        &#8594;{home.callToAction[lang]}
      </Anchor>
    </p>
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
    margin-left: var(--space-7);
    list-style: disc;
  }

  blockquote {
    position: relative;
    margin-bottom: var(--space-4);
  }

  cite {
    font-size: inherit;
    display: block;
    transition: all 1s;
  }

  blockquote > span {
    margin-left: var(--space-1);
    transition: all 1s;
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
  }
</style>
