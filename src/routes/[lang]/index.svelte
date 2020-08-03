<script context="module">
  export async function preload() {
    const res = await this.fetch('index.json')
    if (res.status === 200) {
      const data = await res.json()
      return { data }
    }
    this.error(404, 'Not found')
  }
</script>

<script>
  import { onMount } from 'svelte'
  import { _ } from 'svelte-i18n'
  import { pageCode, pageHeader } from '@/stores.js'
  import SEO from '@/components/SEO.svelte'

  export let data

  $pageHeader = $_('home.header')

  onMount(() => {
    $pageCode = atob(data.content)
  })
</script>

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

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
  }
  /* Desktop - 1080px*/
  @media only screen and (min-width: 67.5em) {
    p {
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
