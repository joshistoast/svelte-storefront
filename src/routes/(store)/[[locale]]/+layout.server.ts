import type { LayoutServerLoad } from './$types'
import { layoutQuery, CART_QUERY } from '$lib/server/data'
import invariant from 'tiny-invariant'
import { getCartId } from '$lib/utils'

export const load: LayoutServerLoad = async ({ locals, request }) => {
  const { storefront, locale } = locals
  const cartId = getCartId(request)

  const getLayoutData = async () => {
    const { data } = await storefront.query({
      query: layoutQuery,
      variables: {
        language: locale.language,
        headerMenuHandle: 'main-menu',
        footerMenuHandle: 'footer',
      }
    })
    invariant(data, 'No data returned from Shopify API')

    return data
  }

  const getCart = async (cartId: string) => {
    const { data } = await storefront.query<{
      cart: import('$lib/types').Cart
    }>({
      query: CART_QUERY,
      variables: {
        country: locale.country,
        cartId,
      },
      fetchPolicy: 'no-cache'
    })
    invariant(data, 'No data returned from Shopify API')

    return data.cart
  }

  const layout = await getLayoutData()

  return {
    layout: {
      ...layout,
      cart: cartId ? await getCart(cartId) : undefined,
    },
    selectedLocale: locale,
  }
}
