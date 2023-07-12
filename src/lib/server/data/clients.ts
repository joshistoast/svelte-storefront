import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { env } from '$env/dynamic/public'

const apiVersion = env.PUBLIC_STOREFRONT_API_VERSION || '2023-07'
const storeDomain = env.PUBLIC_STORE_DOMAIN
const token = env.PUBLIC_STOREFRONT_API_TOKEN

const endpointUrl = `https://${storeDomain}/api/${apiVersion}/graphql.json`

const shopify = new ApolloClient({
  uri: endpointUrl,
  cache: new InMemoryCache(),
  ssrMode: true,
  headers: {
    'Accept-Language': 'en-US',
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token,
  },
})

export {
  shopify
}
