<script context="module">
  export async function preload() {
    const url =
      'https://api.github.com/repos/zwergius/el-danes/contents/src/routes/%5Blang%5D/index.svelte'
    const res = await this.fetch(url, {
      'User-Agent': 'zwergius',
    })
    if (res.status === 200) {
      const data = await res.json()
      return { data }
    }
    // this.error(404, 'Not found')
  }
</script>

<script>
  import { _ } from 'svelte-i18n'
  import { pageCode } from '@/stores.js'
  import SEO from '@/components/SEO.svelte'

  export let data

  $pageCode = atob(data.content)
</script>

<!-- HOME | EL DANÉS-->
<SEO />
<div>
  <p>{$_('home.section-1')}</p>
  <p>{$_('home.section-2')}</p>

  <blockquote>
    &#8220;{$_('home.quote')}&#8221;
    <cite>&#8213; {$_('home.quoteAuthor')}</cite>
  </blockquote>

  <p>{$_('home.section-3')}</p>
  <p>{$_('home.section-4')}</p>
</div>

<style>
  div {
    overflow-wrap: break-word;
  }

  p {
    margin-bottom: var(--space-4);
  }

  blockquote {
    margin-bottom: var(--space-4);
  }

  cite {
    font-size: inherit;
    display: block;
  }

  blockquote:hover cite {
    visibility: visible;
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    p {
      margin-bottom: var(--space-5);
    }

    cite {
      visibility: hidden;
    }

    blockquote {
      margin-bottom: var(--space-5);
    }
  }
</style>
