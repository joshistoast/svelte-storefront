// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { ApolloClient } from '@apollo/client'
import type { Locale } from '$lib/types'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      storefront: ApolloClient<NormalizedCacheObject>
      locale: Locale
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {}
