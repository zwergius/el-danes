<script lang="ts">
  import { browser } from '$app/environment'

  export let data

  const { passGoogle, pkpass, language } = data

  let isIOS: boolean
  let isAndroid: boolean
  let isMac: boolean

  if (browser) {
    const { userAgent } = navigator
    isIOS = /(iPhone|iPad|iPod)/.test(userAgent)
    isAndroid = /(Android)/.test(userAgent)
    isMac = /(Macintosh)/.test(userAgent)

    if (isIOS || isMac) {
      window.location.href = pkpass
    } else if (isAndroid) {
      window.location.href = passGoogle
    }
  }
</script>

<div class="container">
  <a rel="external" href={pkpass}>
    <img
      class="wallet-logo"
      src="/src/lib/assets/apple-wallet-{language}.svg"
      alt="add the card to your wallet for ios"
    />
  </a>
  <a rel="external" target="_blank" href={passGoogle}>
    <img
      class="wallet-logo"
      src="/src/lib/assets/google-wallet-{language}.svg"
      alt="add the card to your wallet for android"
    />
  </a>
</div>

<style>
  .container {
    gap: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .wallet-logo {
    width: auto;
    height: 60px;
  }
  @media only screen and (max-width: 1024px) {
    .container {
      flex-direction: column;
      padding-top: var(--header-height);
    }
  }
</style>
