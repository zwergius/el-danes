; (function() {
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

  // should match const in src/lib/constants
  let themeConfig = {
    dark: [
      { name: '--text', value: '#fff' },
      { name: '--background', value: '#000' },
      { name: '--overlay', value: 'rgb(0, 0, 0, 0.8)' },
    ],
    light: [
      { name: '--text', value: '#000' },
      { name: '--background', value: '#fff' },
      { name: '--overlay', value: 'rgb(255, 255, 255)' },
    ],
  }
  let colorMode = getInitialColorMode()
  let root = document.documentElement
  const meta = document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = colorMode === 'dark' ? '#000' : '#fff'
  document.head.append(meta)

  themeConfig[colorMode].forEach(({ name, value }) => {
    root.style.setProperty(name, value)
  })
  root.style.setProperty('--color-mode', colorMode)
})()
