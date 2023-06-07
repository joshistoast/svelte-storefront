import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { env } from '$env/dynamic/public'

const apiVersion = env.PUBLIC_STOREFRONT_API_VERSION || '2023-04'
const storeDomain = env.PUBLIC_STORE_DOMAIN

const endpointUrl = `https://${storeDomain}/api/${apiVersion}/graphql.json`

const shopify = new ApolloClient({
  uri: endpointUrl,
  cache: new InMemoryCache(),
  headers: {
    'Accept-Language': 'en-US',
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': env.PUBLIC_STOREFRONT_API_TOKEN,
  },
})

export {
  shopify
}
