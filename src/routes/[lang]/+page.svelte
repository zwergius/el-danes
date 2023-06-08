<script lang="ts">
  import LL from '$i18n/i18n-svelte'
  import { pageHeader } from '$lib/stores'
  import SEO from '$lib/components/SEO.svelte'
  import { browser } from '$app/environment'
  // import Anchor from '$lib/components/Anchor.svelte'
  // import type { PageData } from './$types'

  // /** @type {import('./$types').PageData */
  // export let data: PageData
  // let { email } = data
  // $: ({ email } = data)

  $pageHeader = $LL.home.header()

  // function handleEmail(e: Event) {
  //   e.preventDefault()
  //   window.location.href = `mailto:${email}?subject=${$LL.mailToSubject()}`
  // }
  const words = [
    { word: 'Ecommerce' },
    { word: 'CrossPlatform' },
    { word: 'WebDevelopment' },
    { word: 'Empowering' },
  ]
  let index = 0
  let interval: number
  const next = () => {
    index = (index + 1) % words.length
  }
  let show = false

  function flipboard(node, params) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    const text = node.textContent.trim()

    function randomRangeNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
    let lastTime = 0
    return {
      duration: 3000,
      ...params,
      tick(t: number) {
        if (t === 1) {
          node.textContent = text
          return
        }
        const time = Date.now()
        if (time - lastTime < 50) {
          return
        }

        lastTime = time

        let str = ' '
        for (let i = 0; i < randomRangeNumber(1, 5); i++) {
          const progress = i / randomRangeNumber(1, 5)
          if (text[i] === ' ' || progress < t * 0.9) {
            str = text[i]
          } else if (progress < t * 1.5) {
            str = randomChars[Math.floor(Math.random() * randomChars.length)]
          } else if (progress < t * 2) {
            str = '-'
          } else {
            str = ' '
          }
        }
        node.textContent = str
      },
    }
  }
  let ms = 4000
  $: if (browser) {
    clearInterval(interval)
    interval = window.setInterval(next, ms)
  }
</script>

<SEO />

<div class="letters">
  <section>
    <div>
      <label>
        <input bind:checked={show} type="checkbox" /> Show
      </label>
    </div>
    {#if show}
      <div class="box">
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="sign" />
        <div class="box2">
          {#each [words[index]] as { word } (index)}
            {#each word as letter}
              <p transition:flipboard>{letter}</p>
            {/each}
          {/each}
        </div>
      </div>
    {/if}
  </section>

  <!-- <section>
    <p>{$LL.home.section2()}</p>

    <ul>
      <li>{$LL.home.section2item1()}</li>
      <li>{$LL.home.section2item2()}</li>
    </ul>
  </section>

  <section>
    <p>{$LL.home.section3()}</p>
  </section>

  <blockquote>
    <span>&#8220;{$LL.home.quote()}&#8221;</span>
    <cite>&#8213; {$LL.home.author()}</cite>
  </blockquote>

  <section>
    <p>{$LL.home.section4()}</p>

    <ul>
      <li>{$LL.home.section4item1()}</li>
      <li>{$LL.home.section4item2()}</li>
    </ul>

    <p>{$LL.home.section5()}</p>
  </section>

  <section>
    <p>{$LL.home.section6()}</p>
  </section>

  <section>
    <Anchor class="call-to-action" onClick={handleEmail}>
      &#8594;{$LL.home.callToAction()}
    </Anchor>
  </section> -->
</div>

<style>
  p {
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box2 {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
  }

  .box {
    position: relative;
    display: flex;
  }

  .sign {
    width: 1em;
    height: 1em;
    display: inline-block;
    margin: 0 auto;
    border-radius: 0.05em;
    border: 0.01em solid #000000;
    position: relative;
    background: white;
    text-align: center;
    line-height: 1;
    font-size: 80px;
    color: black;
    font-family: monospace;
    box-shadow: 0px 0.02em 0 #ccc, 0px 0.05em 0 black;
    text-shadow: -1px -2px 2px rgb(140, 140, 140);
    z-index: 50;
  }
  /* .sign:before {
    display: block;
    width: 100%;
    height: 0px;
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    margin: 0 auto;
    margin-left: -0.05em;
    border: 0.05em solid black;
    z-index: -10;
  } */

  .sign:after {
    position: absolute;
    top: 50%;
    left: 0;
    content: '';
    border-top: 2px solid rgb(0, 0, 0);
    border-bottom: 3px solid rgba(183, 183, 183, 0.3);
    width: 100%;
    height: 0px;
    opacity: 0.8;
    z-index: 10;
    margin-top: -1px;
  }
  .letters {
    margin-top: 100px;
  }
  div {
    overflow-wrap: break-word;
  }

  section {
    margin-bottom: var(--space-4);
  }

  /* ul {
    margin: var(--space-3) 0;
    margin-left: var(--space-4);
    list-style: disc;
  }

  li {
    margin-bottom: var(--space-3);
  }

  blockquote {
    position: relative;
    margin-bottom: var(--space-4);
  }

  cite {
    font-size: inherit;
    display: block;
  }

  blockquote > span {
    margin-left: var(--space-1);
  }

  blockquote:hover span {
    opacity: 0;
  }

  blockquote:hover cite {
    opacity: 1;
  } */

  :global(button.call-to-action::after) {
    width: 100%;
  }

  /* Tablet - 768px */
  /* @media only screen and (min-width: 48em) {
    ul {
      margin-left: var(--space-5);
    }
  } */
  /* Desktop - 1080px*/
  /* @media only screen and (min-width: 67.5em) {
    section {
      margin-bottom: var(--space-5);
    } */

  /* cite {
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
  } */
  /* Desktop 2560px*/
  /* @media only screen and (min-width: 160em) {
    ul {
      margin-left: var(--space-7);
    }
  } */
</style>
