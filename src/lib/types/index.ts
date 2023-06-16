import type * as S from './storefront-api'
export type * from './storefront-api'

export type Locale = {
  language: S.LanguageCode
  country: S.CountryCode
  label: string
  currency: S.CurrencyCode
}
export type Localizations = Record<string, Locale>

export enum CartAction {
  ADD_TO_CART = 'ADD_TO_CART',
  REMOVE_FROM_CART = 'REMOVE_FROM_CART',
  UPDATE_CART = 'UPDATE_CART',
  UPDATE_DISCOUNT = 'UPDATE_DISCOUNT',
  UPDATE_BUYER_IDENTITY = 'UPDATE_BUYER_IDENTITY',
}

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
}
