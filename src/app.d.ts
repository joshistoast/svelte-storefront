// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { ApolloClient } from '@apollo/client'
import type { Locale } from '$lib/types'
import type { Session } from 'svelte-kit-cookie-session'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      storefront: ApolloClient<NormalizedCacheObject>
      locale: Locale
      session: Session
    }
    interface PageData {
      session?: Session
      seo?: {
        title: string
        description: string
        [key: string]: string | undefined
      }
    }
    // interface Platform {}
  }
}

export {}
