;(function () {
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

  var theme = {
    dark: [
      { name: '--text', value: 'white' },
      { name: '--background', value: 'black' },
    ],
    light: [
      { name: '--text', value: 'black' },
      { name: '--background', value: 'white' },
    ],
  }
  var colorMode = getInitialColorMode()
  var root = document.documentElement

  theme[colorMode].forEach(({ name, value }) => {
    root.style.setProperty(name, value)
  })
  root.style.setProperty('--color-mode', colorMode)
})()
