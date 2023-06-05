import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { env } from '$env/dynamic/public'

const endpointUrl = `https://${env.PUBLIC_STORE_DOMAIN}/api/${env.PUBLIC_STOREFRONT_API_VERSION}/graphql.json`

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
