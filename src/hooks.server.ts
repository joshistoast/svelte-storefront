import type { Handle, RequestEvent } from '@sveltejs/kit'
import { shopify as storefront, countries } from '$lib/server/data'
import { redirect } from '@sveltejs/kit'
import type { Locale } from '$lib/types'
import { handleSession } from 'svelte-kit-cookie-session'
import { env } from '$env/dynamic/private'

const getLocale = (event: RequestEvent<Partial<Record<string, string>>>): Locale => {
  const { locale } = event.params
  const defaultParam = 'en-us'

  const acceptLanguage = event.request.headers.get('Accept-Language')
  const preferredLanguage = acceptLanguage?.split(',')[0]?.toLowerCase()
  const localeParam = locale || preferredLanguage || defaultParam
  const selectedLocale = countries[localeParam] || countries[defaultParam]

  if (locale === defaultParam || !countries[localeParam]) {
    const originalUrl = event.request.url
    const withoutLocaleUrl = originalUrl.replace(`/${localeParam}`, '')
    throw redirect(302, withoutLocaleUrl)
  }

  return selectedLocale
}

export const handle: Handle = handleSession({
  secret: env.SESSION_SECRET,
}, async ({ event, resolve }) => {
  const locale = getLocale(event)

  event.locals.storefront = storefront
  event.locals.locale = locale

  return await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', locale.language)
  })
})
