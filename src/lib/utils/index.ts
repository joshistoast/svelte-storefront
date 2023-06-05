import type { MenuItem, MoneyV2 } from '$lib/types'
import { readable } from 'svelte/store'
import { page } from '$app/stores'
import { countries } from '$lib/server/data'

export const useTimeAgo = (a: Date, b: Date) => {
  const msDiff = b.getTime() - a.getTime()

  if (msDiff < (10 * 1000)) return 'just a moment ago'
  if (msDiff < (60 * 1000)) return 'less than a minute ago'

  const minsDiff = Math.floor(msDiff / (60 * 1000))

  if (minsDiff === 1) return 'a minute ago'
  if (minsDiff < 60) return `${minsDiff} minutes ago`

  const hrsDiff = Math.floor(msDiff / (60 * 60 * 1000))

  if (hrsDiff === 1) return 'an hour ago'
  if (hrsDiff < 24) return `${hrsDiff} hours ago`

  const aDay = new Date(a.getFullYear(), a.getMonth(), a.getDate())
  const bDay = new Date(b.getFullYear(), b.getMonth(), b.getDate())
  const daysDiff = Math.floor((bDay.getTime() - aDay.getTime()) / (24 * 60 * 60 * 1000))

  if (daysDiff === 1) return 'yesterday'
  if (daysDiff < 7) return `${daysDiff} days ago`
  if (daysDiff === 7) return 'a week ago'
  if (daysDiff < 28) return `${Math.ceil(daysDiff / 7)} weeks ago`
  if (daysDiff < 335) return `${Math.ceil(daysDiff / (265 / 12))} months ago`

  const yrsDiff = Math.round(daysDiff / 365)
  return `${yrsDiff} ${yrsDiff === 1 ? 'year' : 'years'} ago`
}

export const useNow = readable(new Date(), (set) => {
  const interval = setInterval(() => {
    set(new Date())
  }, 1000)

  return () => clearInterval(interval)
})

export const useExcerpt = (text: string) => {
  const regex = /<p.*>(.*?)<\/p>/
  const match = regex.exec(text)
  return match?.length ? match[0] : ''
}

export const DEFAULT_LOCALE = Object.freeze({
  ...countries['en-us'],
  pathPrefix: ''
})

export const usePrefixPathWithLocale = (path: string) => {
  const selectedLocale = page.subscribe((page) => page.params['locale']) ?? DEFAULT_LOCALE
  return `${selectedLocale}/${path}`
}

/**
 * Shopify's 'Online Store' stores cart IDs in a 'cart' cookie.
 * By doing the same, merchants can switch from the Online Store to Hydrogen
 * without customers losing carts.
 */
export const getCartId = (request: Request) => {
  const cookies = request.headers.get('cookie')
  const cartCookie = cookies?.split(';').find((cookie) => cookie.trim().startsWith('cart='))
  return cartCookie ? `gid://shopify/Cart/${cartCookie?.split('=')[1]}` : undefined
}

/**
 * Validates that a url is local
 * @param url
 * @returns `true` if local `false`if external domain
 */
export const isLocalPath = (path: string) => {
  try {
    new URL(path)
  } catch(e) {
    return true
  }
  return false
}

/**
 * Product Detail Utils
 */

export const isNewArrival = (date: Date, daysOld = 30) => {
  return (
    date.getTime().valueOf() >
    new Date().setDate(new Date().getDate() - daysOld).valueOf()
  )
}

export const isDiscounted = (price: MoneyV2, compareAtPrice: MoneyV2) => {
  if (compareAtPrice?.amount > price?.amount)
    return true
  return false
}
