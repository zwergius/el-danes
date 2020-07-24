<script context="module">
  export async function preload() {
    const url =
      process.env.NODE_ENV === 'development'
        ? '/mock.json'
        : 'https://api.github.com/repos/zwergius/el-danes/contents/src/routes/%5Blang%5D/index.svelte'
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
  console.log(process.env.NODE_ENV)

  $pageCode = atob(data.content)
</script>

<!-- HOME | EL DANÉS-->
<SEO />
<div>
  <p>{$_('home.section-1')}</p>
  <p>{$_('home.section-2')}</p>

  <blockquote>
    <span>&#8220;{$_('home.quote')}&#8221;</span>
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
    position: relative;
    margin-bottom: var(--space-4);
  }

  cite {
    position: absolute;
    top: 0;
    left: 0;
    font-size: inherit;
    display: block;
    transition: all 1s;
  }

  blockquote > span {
    transition: all 1s;
  }

  blockquote:hover span {
    opacity: 0;
  }

  blockquote:hover cite {
    opacity: 1;
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
      opacity: 0;
    }

    blockquote {
      margin-bottom: var(--space-5);
    }
  }
</style>
