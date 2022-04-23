/// <reference types="@sveltejs/kit" />

interface ImportMetaEnv {
  VITE_EMAIL: string
  VITE_PHONE_NO: string
}

declare module '*.yaml' {
  const content: { [key: string]: any }
  export default content
}

declare namespace svelte.JSX {
  interface HTMLProps<T> {
    onpanstart?: (e: CustomEvent) => void
    onpanmove?: (e: CustomEvent) => void
    onpanend?: (e: CustomEvent) => void
  }
}
