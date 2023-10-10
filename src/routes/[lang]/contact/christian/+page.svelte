<script lang="ts">
  import { browser } from '$app/environment'
  import downloadIosBig from '$lib/assets/ios-wallet-big.svg'
  import downloadIos from '$lib/assets/ios-wallet.svg'
  import downloadIosMediun from '$lib/assets/ios-wallet-mediun.svg'
  import downloadAndroid from '$lib/assets/google-wallet.svg'
  import downloadAndroidBig from '$lib/assets/google-wallet-b.svg'
  import downloadAndroidMediun from '$lib/assets/google-wallet-mediun.svg'
  import LinkWallet from '$lib/components/link-wallet.svelte'

  export let data
  const { passGoogle, pkpass } = data

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

<div class="add-wallet mobile">
  <LinkWallet href={pkpass} src={downloadIos} />
  <LinkWallet href={passGoogle} src={downloadAndroid} />
</div>
<div class="add-wallet tablet">
  <LinkWallet href={pkpass} src={downloadIosMediun} />
  <LinkWallet href={passGoogle} src={downloadAndroidMediun} />
</div>
<div class="add-wallet desktoc">
  <LinkWallet href={pkpass} src={downloadIosBig} />
  <LinkWallet href={passGoogle} src={downloadAndroidBig} />
</div>

<style>
  .add-wallet {
    padding-top: 50px;
    flex-direction: column;
    gap: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tablet {
    display: none;
  }
  .mobile {
    display: none;
  }
  @media only screen and (max-width: 1024px) {
    .add-wallet {
      padding-top: 160px;
    }
    .desktoc {
      display: none;
    }
    .tablet {
      display: flex;
    }
    .mobile {
      display: none;
    }
  }
  @media only screen and (max-width: 767px) {
    .mobile {
      display: flex;
    }
    .desktoc {
      display: none;
    }
    .tablet {
      display: none;
    }
  }
</style>
