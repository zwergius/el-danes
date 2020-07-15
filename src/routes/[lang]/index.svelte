<script>
  import { _ } from 'svelte-i18n'
  import SEO from '@/components/SEO.svelte'
</script>

<SEO />
<section>
  <p>{$_('home.section-1')}</p>
  <p>{$_('home.section-2')}</p>

  <blockquote>
    &#8220;{$_('home.quote')}&#8221;
    <cite>&#8213; {$_('home.quoteAuthor')}</cite>
  </blockquote>

  <p>{$_('home.section-3')}</p>
  <p>{$_('home.section-4')}</p>
</section>

<style>
  section {
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
