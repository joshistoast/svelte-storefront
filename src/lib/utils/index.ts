import type { CurrencyCode, Locale, MoneyV2 } from '$lib/types'
import { readable } from 'svelte/store'
import { page } from '$app/stores'

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

export type UseMoneyValue = {
  /**
   * The currency code from the `MoneyV2` object.
   */
  currencyCode: CurrencyCode;
  /**
   * The name for the currency code, returned by `Intl.NumberFormat`.
   */
  currencyName?: string;
  /**
   * The currency symbol returned by `Intl.NumberFormat`.
   */
  currencySymbol?: string;
  /**
   * The currency narrow symbol returned by `Intl.NumberFormat`.
   */
  currencyNarrowSymbol?: string;
  /**
   * The localized amount, without any currency symbols or non-number types from the `Intl.NumberFormat.formatToParts` parts.
   */
  amount: string;
  /**
   * All parts returned by `Intl.NumberFormat.formatToParts`.
   */
  parts: Intl.NumberFormatPart[];
  /**
   * A string returned by `new Intl.NumberFormat` for the amount and currency code,
   * using the `locale` value in the [`LocalizationProvider` component](https://shopify.dev/api/hydrogen/components/localization/localizationprovider).
   */
  localizedString: string;
  /**
   * The `MoneyV2` object provided as an argument to the hook.
   */
  original: MoneyV2;
  /**
   * A string with trailing zeros removed from the fractional part, if any exist. If there are no trailing zeros, then the fractional part remains.
   * For example, `$640.00` turns into `$640`.
   * `$640.42` remains `$640.42`.
   */
  withoutTrailingZeros: string;
  /**
   * A string without currency and without trailing zeros removed from the fractional part, if any exist. If there are no trailing zeros, then the fractional part remains.
   * For example, `$640.00` turns into `640`.
   * `$640.42` turns into `640.42`.
   */
  withoutTrailingZeroesAndCurrency: string;
}

export const useLazyFormatter = (
  locale: string,
  options?: Intl.NumberFormatOptions
): () => Intl.NumberFormat => {
  return () => new Intl.NumberFormat(locale, options)
}

export const useMoney = (
  locale: string,
  money: MoneyV2,
): UseMoneyValue => {
  const amount = parseFloat(money.amount)
  const options = {
    style: 'currency',
    currency: money.currencyCode,
  }
  const withoutTrailingZerosOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }

  const defaultFormatter = useLazyFormatter(locale, options)

  const nameFormatter = useLazyFormatter(locale, {
    ...options,
    currencyDisplay: 'name',
  })

  const narrowSymbolFormatter = useLazyFormatter(locale, {
    ...options,
    currencyDisplay: 'narrowSymbol',
  })

  const withoutTrailingZerosFormatter = useLazyFormatter(locale, {
    ...options,
    ...withoutTrailingZerosOptions,
  })

  const withoutCurrencyFormatter = useLazyFormatter(locale)

  const withoutTrailingZerosOrCurrencyFormatter = useLazyFormatter(locale, {
    ...withoutTrailingZerosOptions,
  })

  const isPartCurrency = (part: Intl.NumberFormatPart) => part.type === 'currency'

  const lazyFormatters = ({
    original: () => money,
    currencyCode: () => money.currencyCode,
    localizedString: () => defaultFormatter().format(amount),

    parts: () => defaultFormatter().formatToParts(amount),

    withoutTrailingZeroes: () =>
      amount % 1 === 0
        ? withoutTrailingZerosFormatter().format(amount)
        : defaultFormatter().format(amount),

    withoutTrailingZeroesAndCurrency: () =>
      amount % 1 === 0
        ? withoutTrailingZerosOrCurrencyFormatter().format(amount)
        : withoutCurrencyFormatter().format(amount),

    currencyName: () =>
      nameFormatter().formatToParts(amount).find(isPartCurrency)?.value ??
      money.currencyCode, // e.g. "US dollars"

    currencySymbol: () =>
      defaultFormatter().formatToParts(amount).find(isPartCurrency)?.value ??
      money.currencyCode, // e.g. "USD"

    currencyNarrowSymbol: () =>
      narrowSymbolFormatter().formatToParts(amount).find(isPartCurrency)
        ?.value ?? '', // e.g. "$"

    amount: () =>
      defaultFormatter()
        .formatToParts(amount)
        .filter((part) =>
          ['decimal', 'fraction', 'group', 'integer', 'literal'].includes(
            part.type
          )
        )
        .map((part) => part.value)
        .join(''),
  })

  // Call functions automatically when the properties are accessed
  // to keep these functions as an implementation detail
  return new Proxy(lazyFormatters as any as UseMoneyValue, {
    get: (target, key) => {
      return Reflect.get(target, key)?.call(null)
    }
  })
}

export const useLocaleKey = (locale: Locale) => {
  if (locale.country === 'US')
    return undefined

  return `${locale.language.toLowerCase()}-${locale.country.toLowerCase()}`
}
