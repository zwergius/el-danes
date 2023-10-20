<script lang="ts">
  import { browser } from '$app/environment'
  import googleWalletDk from '$lib/assets/google-wallet-dk.svg'
  import googleWalletEs from '$lib/assets/google-wallet-es.svg'
  import googleWalletEn from '$lib/assets/google-wallet-en.svg'
  import iosWalletDk from '$lib/assets/apple-wallet-dk.svg'
  import iosWalletEs from '$lib/assets/apple-wallet-es.svg'
  import iosWalletEn from '$lib/assets/apple-wallet-en.svg'

  export let data

  const { passGoogle, pkpass, url } = data

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
  {#if url.pathname === '/da/contact/christian'}
    <a rel="external" href={pkpass}>
      <img
        class="wallet-logo"
        src={iosWalletDk}
        alt="add the card to your wallet for ios"
      />
    </a>
    <a rel="external" target="_blank" href={passGoogle}>
      <img
        class="wallet-logo"
        src={googleWalletDk}
        alt="add the card to your wallet for android"
      /></a
    >
  {:else if url.pathname === '/es/contact/christian'}
    <a rel="external" href={pkpass}>
      <img
        class="wallet-logo"
        src={iosWalletEs}
        alt="add the card to your wallet for ios"
      />
    </a>
    <a rel="external" target="_blank" href={passGoogle}>
      <img
        class="wallet-logo"
        src={googleWalletEs}
        alt="add the card to your wallet for android"
      />
    </a>
  {:else if url.pathname === '/en/contact/christian'}
    <a rel="external" href={pkpass}>
      <img
        class="wallet-logo"
        src={iosWalletEn}
        alt="add the card to your wallet for ios"
      />
    </a>
    <a rel="external" target="_blank" href={passGoogle}>
      <img
        class="wallet-logo"
        src={googleWalletEn}
        alt="add the card to your wallet for android"
      />
    </a>
  {/if}
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
