import { writable } from 'svelte/store'

export let theme = writable(null)

if (typeof window !== 'undefined') {
  const root = window.document.documentElement
  theme.set(root.style.getPropertyValue('--color-mode'))
}

export let pageHeader = writable('')
