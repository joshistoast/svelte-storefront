import type { PageServerLoad } from './$types'
import { FEATURED_ITEMS_QUERY, SEARCH_QUERY } from '$lib/server/data'
import type { CollectionConnection, ProductConnection } from '$lib/types'
import invariant from 'tiny-invariant'

export const load: PageServerLoad = async ({ url, locals }) => {
  const { storefront, locale } = locals

  // Set up variables
  const searchTerm = url.searchParams.get('q')
  const endCursor = url.searchParams.get('after')
  const variables = {
    endCursor,
    first: searchTerm ? 8 : 0, // If there is a search term, show 8 products, otherwise show none
  }

  // Fetch products
  const { data } = await storefront.query<{
    products: ProductConnection
  }>({
    query: SEARCH_QUERY,
    variables: {
      searchTerm: searchTerm,
      ...variables,
      country: locale.country,
      language: locale.language,
    },
  })
  const { products } = data
  const shouldGetRecommendations = !searchTerm || products?.nodes?.length === 0

  const getNoResultRecommendations = async () => {
    const { data } = await storefront.query<{
      featuredCollections: Pick<CollectionConnection, 'nodes'>
      featuredProducts: Pick<ProductConnection, 'nodes'>
    }>({
      query: FEATURED_ITEMS_QUERY,
    })

    invariant(data, 'No featured items data returned from Shopify API')

    return data
  }

  return {
    products,
    noResultRecommendations: shouldGetRecommendations // If there is no search term or results, get recommendations
      ? await getNoResultRecommendations()
      : Promise.resolve(undefined),
    searchTerm,
    seo: {
      title: 'Search',
    }
  }
}
