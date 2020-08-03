import { writable } from 'svelte/store'

export let theme
if (typeof window !== 'undefined') {
  const root = window.document.documentElement
  theme = writable(root.style.getPropertyValue('--color-mode'))
}

export let pageCode = writable('')
export let pageHeader = writable('')
