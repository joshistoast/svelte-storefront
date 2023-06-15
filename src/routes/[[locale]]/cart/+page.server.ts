import type { shopify } from '$lib/server/data'
import type {
  Actions,
  PageServerLoad,
  RequestEvent,
} from './$types'
import { redirect } from '@sveltejs/kit'
import type {
  CartLineInput,
  CartUserError,
  UserError,
  CartInput,
  CartBuyerIdentityInput,
  CartLinesAddPayload,
  CartCreatePayload,
  CartLinesRemovePayload,
  CartDiscountCodesUpdatePayload,
  CartLinesUpdatePayload,
  CartBuyerIdentityUpdatePayload,
  Maybe,
  Cart,
  Locale,
} from '$lib/types'
import {
  CART_QUERY,
  CREATE_CART_MUTATION,
  ADD_LINES_MUTATION,
  REMOVE_LINES_MUTATION,
  DISCOUNT_CODES_UPDATE,
  LINES_UPDATE_MUTATION,
  UPDATE_CART_BUYER,
} from '$lib/server/data'
import invariant from 'tiny-invariant'
import { getCartId, isLocalPath } from '$lib/utils'

type Storefront = typeof shopify

const cartRetrieve = async (cartId: string, storefront: Storefront, locale?: Locale) => {
  // return a cart
  const { data } = await storefront.query<{
    cart: Cart
    errors: CartUserError[]
  }>({
    query: CART_QUERY,
    variables: {
      cartId,
      country: locale?.country || undefined,
      language: locale?.language || undefined,
    },
    fetchPolicy: 'no-cache',
  })
  invariant(data?.cart, 'No cart returned from cart query')
  return data
}

const cartCreate = async (input: CartInput, storefront: Storefront, locale?: Locale) => {
  // create a cart
  const { data } = await storefront.mutate<{
    cartCreate: CartCreatePayload
  }>({
    mutation: CREATE_CART_MUTATION,
    variables: {
      input,
      country: locale?.country || undefined,
      language: locale?.language || undefined,
    },
  })
  invariant(data?.cartCreate, 'No cart returned from cartCreate mutation')
  return data.cartCreate
}

const cartAdd = async (cartId: string, lines: CartLineInput[], storefront: Storefront) => {
  const { data } = await storefront.mutate<{
    cartLinesAdd: CartLinesAddPayload
  }>({
    mutation: ADD_LINES_MUTATION,
    variables: { cartId, lines },
  })
  invariant(data?.cartLinesAdd, 'No data returned from cartLinesAdd mutation')
  return data.cartLinesAdd
}

const cartRemove = async (cartId: string, lineIds: Cart['id'][], storefront: Storefront) => {
  // remove lines from a cart
  const { data } = await storefront.mutate<{
    cartLinesRemove: CartLinesRemovePayload,
  }>({
    mutation: REMOVE_LINES_MUTATION,
    variables: { cartId, lineIds },
  })
  invariant(data?.cartLinesRemove, 'No data returned from remove lines mutation')
  return data.cartLinesRemove
}

const cartUpdate = async (cartId: string, lines: CartLineInput[], storefront: Storefront) => {
  // update lines in a cart
  const { data } = await storefront.mutate<{
    cartLinesUpdate: CartLinesUpdatePayload,
  }>({
    mutation: LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
  })
  invariant(data?.cartLinesUpdate, 'No data returned from update lines mutation')
  return data.cartLinesUpdate
}

const cartDiscountCodesUpdate = async (cartId: string, discountCodes: string[], storefront: Storefront) => {
  const { data } = await storefront.mutate<{
    cartDiscountCodesUpdate: CartDiscountCodesUpdatePayload
  }>({
    mutation: DISCOUNT_CODES_UPDATE,
    variables: { cartId, discountCodes },
  })
  invariant(data?.cartDiscountCodesUpdate, 'No data returned from the discount codes update mutation')
  return data.cartDiscountCodesUpdate
}

const cartUpdateBuyerIdentity = async (cartId: string, buyerIdentity: CartBuyerIdentityInput, storefront: Storefront) => {
  const { data } = await storefront.mutate<{
    cartBuyerIdentityUpdate: CartBuyerIdentityUpdatePayload
  }>({
    mutation: UPDATE_CART_BUYER,
    variables: { cartId, buyer: buyerIdentity },
  })
  invariant(
    data?.cartBuyerIdentityUpdate,
    'No data returned from the buyer identity update mutation'
  )
  return data.cartBuyerIdentityUpdate
}

export const load: PageServerLoad = async ({ request, locals }) => {
  // return a cart
  const { storefront, locale } = locals

  let result: {
    cart?: Maybe<Cart>
    errors?: CartUserError[] | UserError[]
  } = {}

  const cartId = getCartId(request)
  !cartId
    ? result = { cart: undefined, errors: undefined }
    : result = await cartRetrieve(cartId, storefront, locale)

  const { cart, errors } = result
  return {
    cart,
    errors,
  }
}

enum CartAction {
  ADD_TO_CART = 'ADD_TO_CART',
  REMOVE_FROM_CART = 'REMOVE_FROM_CART',
  UPDATE_CART = 'UPDATE_CART',
  UPDATE_DISCOUNT = 'UPDATE_DISCOUNT',
  UPDATE_BUYER_IDENTITY = 'UPDATE_BUYER_IDENTITY',
}
const handleCartAction = async (event: RequestEvent, action: CartAction) => {
  const { request, locals, cookies } = event
  const { storefront, locale } = locals
  const formData = await request.formData()
  const countryCode = formData.get('countryCode') ? formData.get('countryCode') as CartBuyerIdentityInput['countryCode'] : undefined

  let result: {
    cart?: Maybe<Cart>
    errors?: CartUserError[] | UserError[]
  } = {}

  let cartId = getCartId(request)

  switch (action) {
    case CartAction.ADD_TO_CART: {
      const lines = formData.get('lines')
        ? (JSON.parse(String(formData.get('lines'))) as CartLineInput[])
        : ([] as CartLineInput[])

      invariant(lines.length, 'No lines to add')

      // if no previous cart exists, create a new one with the lines
      if (!cartId)
        result = await cartCreate({
          lines,
          buyerIdentity: countryCode ? { countryCode } : undefined,
        }, locals.storefront, locale)
      else
        result = await cartAdd(cartId, lines, storefront)

      cartId = result.cart?.id ?? cartId
      break
    }
    case CartAction.REMOVE_FROM_CART: {
      invariant(cartId, 'No cart id')
      const lineIds = formData.get('lineIds')
        ? (JSON.parse(String(formData.get('lineIds'))) as Cart['id'][])
        : ([] as Cart['id'][])

      invariant(lineIds.length, 'No line ids to remove')

      if (!cartId)
        result = { cart: undefined, errors: undefined }
      else
        result = await cartRemove(cartId, lineIds, storefront)

      cartId = result.cart?.id ?? cartId
      break
    }
    case CartAction.UPDATE_CART: {
      invariant(cartId, 'No cart id')

      const lines = formData.get('lines')
        ? (JSON.parse(String(formData.get('lines'))) as CartLineInput[])
        : ([] as CartLineInput[])
      invariant(lines.length, 'No lines to update')

      result = await cartUpdate(cartId, lines, storefront)
      cartId = result.cart?.id ?? cartId

      break
    }
    case CartAction.UPDATE_DISCOUNT: {
      invariant(cartId, 'No cart id')

      const formDiscountCode = formData.get('discountCode')
      const discountCodes = ([formDiscountCode] || ['']) as string[]

      result = await cartDiscountCodesUpdate(cartId, discountCodes, locals.storefront)

      cartId = result.cart?.id ?? cartId
      break
    }
    case CartAction.UPDATE_BUYER_IDENTITY: {
      const buyerIdentity = formData.get('buyerIdentity')
        ? (JSON.parse(
          String(formData.get('buyerIdentity')),
        ) as CartBuyerIdentityInput)
        : ({} as CartBuyerIdentityInput)

      invariant({
        buyerIdentity: {
          ...buyerIdentity,
          customerAccessToken: undefined, // TODO
        }
      }, 'No buyer identity')

      result = cartId
        ? await cartUpdateBuyerIdentity(cartId, buyerIdentity, storefront)
        : await cartCreate(
          {
            buyerIdentity: {
              ...buyerIdentity,
              customerAccessToken: undefined, // TODO
            }
          }, storefront)
      cartId = result.cart?.id ?? cartId

      break
    }
    default:
      invariant(false, `${action} is not a valid cart action`)
  }

  // set the cart cookie
  if (cartId)
    cookies.set('cart', `${cartId.split('/').pop()}`)

  // if a redirect is requested, redirect
  const redirectTo = formData.get('redirectTo') ?? undefined
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo))
    throw redirect(303, redirectTo)

  const { cart, errors } = result
  return {
    cart,
    errors,
  }
}

export const actions: Actions = {
  ADD_TO_CART: async (event) => handleCartAction(event, CartAction.ADD_TO_CART),
  REMOVE_FROM_CART: async (event) => handleCartAction(event, CartAction.REMOVE_FROM_CART),
  UPDATE_CART: async (event) => handleCartAction(event, CartAction.UPDATE_CART),
  UPDATE_DISCOUNT: async (event) => handleCartAction(event, CartAction.UPDATE_DISCOUNT),
  UPDATE_BUYER_IDENTITY: async (event) => handleCartAction(event, CartAction.UPDATE_BUYER_IDENTITY)
}
