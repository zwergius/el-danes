<script>
  import { _ } from 'svelte-i18n'
  const aspectRatio = 296.6 / 1197.07 // logo svg viewbox
  let w

  $: margin = (w * aspectRatio).toFixed(2)
</script>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<section bind:clientWidth="{w}" style="margin-top:{margin}px">
  <p>{$_('home.section-1')}</p>
  <p>{$_('home.section-2')}</p>
  <blockquote>&#8220;{$_('home.quote')}&#8221;</blockquote>
  <cite>&#8213; {$_('home.quoteAuthor')}</cite>
  <p>{$_('home.section-3')}</p>
  <p>{$_('home.section-4')}</p>
</section>

<style>
  section {
    padding: var(--space-5) 0;
  }
  p,
  cite {
    margin-bottom: var(--space-5);
    display: block;
  }
</style>
