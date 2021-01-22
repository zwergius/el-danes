<script context="module">
  export async function preload(page, session) {
    const { lang } = page.params
    const { email } = session
    const res = await this.fetch(`/${lang}.json`)
    if (res.status === 200) {
      const code = await res.json()
      return { code, lang, email }
    }
    this.error(404, 'Not found')
  }
</script>

<script>
  import { home, mailToSubject } from 'assets/translations.yaml'
  import { pageCode, pageHeader } from '@/stores'
  import SEO from '@/components/SEO.svelte'
  import Anchor from '@/components/Anchor.svelte'

  export let code, lang, email

  $pageHeader = home.header[lang]
  $pageCode = code

  function handleEmail(e) {
    e.preventDefault()
    window.location.href = `mailto:${email}?subject=${mailToSubject[lang]}`
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
    <p>{home.section6[lang]}</p>
  </section>

  <section>
    <Anchor class="call-to-action" onClick={handleEmail}>
      &#8594;{home.callToAction[lang]}
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
