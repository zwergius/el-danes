<script>
  import { _ } from 'svelte-i18n'
  const aspectRatio = 296.6 / 1197.07 // logo svg viewbox
  let w

  $: margin = (w * aspectRatio).toFixed(2)
</script>

<svelte:head>
  <title>EL DANÉS</title>
</svelte:head>

<section style="margin-top:{margin}px">
  {#if w}
    <p>{$_('home.section-1')}</p>
    <p>{$_('home.section-2')}</p>

    <blockquote>
      &#8220;{$_('home.quote')}&#8221;
      <cite>&#8213; {$_('home.quoteAuthor')}</cite>
    </blockquote>

    <p>{$_('home.section-3')}</p>
    <p>{$_('home.section-4')}</p>
  {/if}
</section>
<div bind:clientWidth="{w}"></div>

<style>
  section {
    padding: var(--space-3) 0;
    overflow-wrap: break-word;
  }

  p {
    margin-bottom: var(--space-4);
  }

  @supports (mix-blend-mode: difference) {
    p,
    blockquote,
    cite {
      color: white;
      mix-blend-mode: difference;
    }
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
    section {
      padding: var(--space-5) 0;
    }

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
