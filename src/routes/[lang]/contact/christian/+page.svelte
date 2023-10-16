<script lang="ts">
  import { browser } from '$app/environment'
  import googleWallet from '$lib/assets/google-wallet.svg'
  import iosWallet from '$lib/assets/ios-wallet.svg'

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

<div class="add-wallet">
  <a href={pkpass}
    ><img class="link-wallet" src={iosWallet} alt="button-ios" /></a
  >
  <a href={passGoogle}
    ><img class="link-wallet" src={googleWallet} alt="button-android" /></a
  >
</div>

<style>
  .add-wallet {
    gap: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .link-wallet {
    width: 320px;
    height: auto;
  }
  @media only screen and (max-width: 1024px) {
    .add-wallet {
      flex-direction: column;
      padding-top: var(--header-height);
    }
    .link-wallet {
      width: 280px;
    }
  }
  @media only screen and (max-width: 767px) {
    .link-wallet {
      width: 200px;
    }
  }
</style>
