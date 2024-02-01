import { gql } from "@apollo/client/core";

export const BRANDING_FRAGMENT = gql`
  fragment Branding on Brand {
    colors {
      primary {
        background
        foreground
      }
      secondary {
        background
        foreground
      }
    }
    coverImage {
      image {
        url
        width
      }
    }
    logo {
      image {
        url
      }
    }
    squareLogo {
      image {
        url
      }
    }
  }
`;

export const SHOP_FRAGMENT = gql`
  ${BRANDING_FRAGMENT}
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      ...Branding
    }
  }
`;

export const MENU_ITEM_FRAGMENT = gql`
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
`;

export const CHILD_MENU_ITEM_FRAGMENT = gql`
  ${MENU_ITEM_FRAGMENT}
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
`;

export const PARENT_MENU_ITEM_FRAGMENT = gql`
  ${MENU_ITEM_FRAGMENT}
  ${CHILD_MENU_ITEM_FRAGMENT}
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
`;

export const MENU_FRAGMENT = gql`
  ${PARENT_MENU_ITEM_FRAGMENT}
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
`;

export const MEDIA_FRAGMENT = gql`
  fragment Media on Media {
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
`;

export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCard on Product {
    id
    title
    publishedAt
    handle
    variants(first: 1) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        product {
          handle
          title
        }
      }
    }
  }
`;

export const PRODUCT_VARIANT_FRAGMENT = gql`
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

export const MONEY_FRAGMENT = gql`
  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }
`;

export const IMAGE_FRAGMENT = gql`
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`;

export const CART_FRAGMENT = gql`
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          attributes {
            key
            value
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              availableForSale
              compareAtPrice {
                ...MoneyFragment
              }
              price {
                ...MoneyFragment
              }
              requiresShipping
              title
              image {
                ...ImageFragment
              }
              product {
                handle
                title
                id
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalDutyAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
    }
  }
`;

export const LINES_CART_FRAGMENT = gql`
  fragment CartLinesFragment on Cart {
    id
    totalQuantity
  }
`;

export const USER_ERROR_FRAGMENT = gql`
  fragment ErrorFragment on CartUserError {
    message
    field
    code
  }
`;

export const ORDER_CARD_FRAGMENT = gql`
  fragment OrderCard on Order {
    id
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    currentTotalPrice {
      amount
      currencyCode
    }
    lineItems(first: 2) {
      edges {
        node {
          variant {
            image {
              url
              altText
              height
              width
            }
          }
          title
        }
      }
    }
  }
`;

export const FEATURED_COLLECTION_FRAGMENT = gql`
  fragment FeaturedCollectionDetails on Collection {
    id
    title
    handle
    image {
      altText
      width
      height
      url
    }
  }
`;
