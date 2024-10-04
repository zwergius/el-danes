import { type Writable, writable } from 'svelte/store'
import { themeConfig } from '$lib/constants'

export let theme: Writable<string>

function getInitialColorMode() {
  const persistedColorPreference = window.localStorage.getItem('color-mode')
  const hasPersistedPreference = typeof persistedColorPreference === 'string'
  // If the user has explicitly chosen light or dark,
  // let's use it. Otherwise, this value will be null.
  if (hasPersistedPreference) {
    return persistedColorPreference
  }
  // If they haven't been explicit, let's check the media
  // query
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const hasMediaQueryPreference = typeof mql.matches === 'boolean'
  if (hasMediaQueryPreference) {
    return mql.matches ? 'dark' : 'light'
  }
  // If they are using a browser/OS that doesn't support
  // color themes, let's default to 'light'.
  return 'light'
}

if (typeof window !== 'undefined') {
  const colorMode = getInitialColorMode()
  const root = document.documentElement

  themeConfig[colorMode].forEach(({ name, value }) => {
    root.style.setProperty(name, value)
  })
  root.style.setProperty('--color-mode', colorMode)

  theme = writable(colorMode)
}
