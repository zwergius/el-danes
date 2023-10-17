/// <reference types="@sveltejs/kit" />

interface ImportMetaEnv {
  VITE_EMAIL: string
  VITE_PHONE_NO: string
}

declare module '*.yaml' {
  const content: { [key: string]: any }
  export default content
}

declare global {
  namespace svelteHTML {
    interface HTMLAttributes<> {
      'on:panmove'?: (event: CustomEvent) => void
      'on:panstart'?: () => void
      'on:panend'?: (event: CustomEvent) => void
    }
  }
}

export {}
