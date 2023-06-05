import type { LayoutServerLoad } from './$types'
import { layoutQuery, CART_QUERY } from '$lib/server/data'
import invariant from 'tiny-invariant'

export const load: LayoutServerLoad = async ({ locals, params, request, url }) => {
  const { storefront, locale } = locals

  const getLayoutData = async () => {
    const { data } = await storefront.query({
      query: layoutQuery,
      variables: {
        language: locale.language,
        headerMenuHandle: 'main',
        footerMenuHandle: 'foot',
      }
    })
    invariant(data, 'No data returned from Shopify API')

    return data
  }

  const layout = await getLayoutData()

  return {
    layout,
    selectedLocale: locale,
  }
}
