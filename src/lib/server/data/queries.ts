import { gql } from '@apollo/client/core'
import {
  PRODUCT_CARD_FRAGMENT,
  BRANDING_FRAGMENT,
  MEDIA_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  SHOP_FRAGMENT,
  MENU_FRAGMENT,
  CART_FRAGMENT,
  LINES_CART_FRAGMENT,
  USER_ERROR_FRAGMENT,
  ORDER_CARD_FRAGMENT,
  FEATURED_COLLECTION_FRAGMENT,
} from './fragments'

export const layoutQuery = gql`
  ${BRANDING_FRAGMENT}
  ${SHOP_FRAGMENT}
  ${MENU_FRAGMENT}
  query layout (
    $language: LanguageCode
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext (language: $language) {
    shop {
      ...Shop
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      ...Menu
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
`

export const collectionQuery = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionDetails (
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
  ) @inContext (country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(
        first: $pageBy,
        after: $cursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`

export const PRODUCT_QUERY = gql`
  ${PRODUCT_VARIANT_FRAGMENT}
  query Product (
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext (country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      media (first: 10) {
        nodes {
           __typename
          mediaContentType
          alt
          previewImage {
            url
          }
          ... on MediaImage {
            id
            image {
              url
              width
              height
            }
          }
          ... on Video {
            id
            sources {
              mimeType
              url
            }
          }
          ... on Model3d {
            id
            sources {
              mimeType
              url
            }
          }
          ... on ExternalVideo {
            id
            embedUrl
            host
          }
        }
      }
      variants (first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        title
        description
      }
    }
  }
`

export const SEARCH_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}

  query PaginatedProductsSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $searchTerm: String
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: RELEVANCE,
      query: $searchTerm
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

export const FEATURED_ITEMS_QUERY = gql`
  query FeaturedItems(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int = 12
  ) @inContext(country: $country, language: $language) {
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        ...FeaturedCollectionDetails
      }
    }
    featuredProducts: products(first: $pageBy) {
      nodes {
        ...ProductCard
      }
    }
  }

  ${PRODUCT_CARD_FRAGMENT}
  ${FEATURED_COLLECTION_FRAGMENT}
`

export const recommendedProductsQuery = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query productRecommendations (
    $productId: ID!
    $count: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`

export const CART_QUERY = gql`
  ${CART_FRAGMENT}
  query CartQuery (
    $cartId: ID!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cart (id: $cartId) {
      ...CartFragment
    }
  }
`

export const CREATE_CART_MUTATION = gql`
  ${LINES_CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
  mutation (
    $input: CartInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cartCreate (input: $input) {
      cart {
        ...CartLinesFragment
        checkoutUrl
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`

export const ADD_LINES_MUTATION = gql`
  ${LINES_CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
  mutation (
    $cartId: ID!
    $lines: [CartLineInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cartLinesAdd (cartId: $cartId, lines: $lines) {
      cart {
        ...CartLinesFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`

export const REMOVE_LINES_MUTATION = gql`
  ${LINES_CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
  mutation (
    $cartId: ID!
    $lineIds: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cartLinesRemove (cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartLinesFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`

export const DISCOUNT_CODES_UPDATE = gql`
  ${CART_FRAGMENT}
  mutation cartDiscountCodesUpdate (
    $cartId: ID!
    $discountCodes: [String!]
    $country: CountryCode
  ) @inContext (country: $country) {
    cartDiscountCodesUpdate (cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartFragment
      }
      errors: userErrors {
        field
        message
      }
    }
  }
`

export const LINES_UPDATE_MUTATION = gql`
  ${LINES_CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
  mutation (
    $cartId: ID!
    $lines: [CartLineUpdateInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cartLinesUpdate (cartId: $cartId, lines: $lines) {
      cart {
        ...CartLinesFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`

export const UPDATE_CART_BUYER = gql`
  ${USER_ERROR_FRAGMENT}
  mutation (
    $cartId: ID!
    $buyer: CartBuyerIdentityInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cartBuyerIdentityUpdate (cartId: $cartId, buyerIdentity: $buyer) {
      cart {
        id
        buyerIdentity {
          email
          phone
          countryCode
        }
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`

export const POLICIES_QUERY = gql`
  fragment PolicyIndex on ShopPolicy {
    id
    title
    handle
  }

  query PoliciesIndex {
    shop {
      privacyPolicy {
        ...PolicyIndex
      }
      shippingPolicy {
        ...PolicyIndex
      }
      termsOfService {
        ...PolicyIndex
      }
      refundPolicy {
        ...PolicyIndex
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`

export const POLICY_CONTENT_QUERY = gql`
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query policy_query(
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) @inContext(language: $language) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
`

export const SITEMAP_QUERY = gql`
  query sitemaps($urlLimits: Int, $language: LanguageCode)
  @inContext(language: $language) {
    products(
      first: $urlLimits
      query: "published_status:'online_store:visible'"
    ) {
      nodes {
        updatedAt
        handle
        onlineStoreUrl
        title
        featuredImage {
          url
          altText
        }
      }
    }
    collections(
      first: $urlLimits
      query: "published_status:'online_store:visible'"
    ) {
      nodes {
        updatedAt
        handle
        onlineStoreUrl
      }
    }
    pages(first: $urlLimits, query: "published_status:'published'") {
      nodes {
        updatedAt
        handle
        onlineStoreUrl
      }
    }
  }
`

export const ARTICLE_QUERY = gql`
  query ArticleDetails(
    $language: LanguageCode
    $blogHandle: String!
    $articleHandle: String!
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`

export const BLOGS_QUERY = gql`
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $pageBy: Int!
    $cursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      handle
      articles(first: $pageBy, after: $cursor) {
        edges {
          node {
            ...Article
          }
        }
      }
    }
  }

  fragment Article on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
  }
`

export const PAGE_QUERY = gql`
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`

export const CUSTOMER_QUERY = gql`
  ${ORDER_CARD_FRAGMENT}

  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerDetails
    }
  }

  fragment AddressPartial on MailingAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    country
    province
    city
    zip
    phone
  }

  fragment CustomerDetails on Customer {
    firstName
    lastName
    phone
    email
    defaultAddress {
      ...AddressPartial
    }
    addresses(first: 6) {
      edges {
        node {
          ...AddressPartial
        }
      }
    }
    orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          ...OrderCard
        }
      }
    }
  }
`

export const CUSTOMER_CREATE_MUTATION = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

export const CUSTOMER_ACTIVATE_MUTATION = gql`
  mutation customerActivate($id: ID!, $input: CustomerActivateInput!) {
    customerActivate(id: $id, input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

export const CUSTOMER_UPDATE_MUTATION = gql`
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`
