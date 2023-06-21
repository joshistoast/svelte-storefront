import type { PageServerLoad, Actions } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'
import { useLocaleKey } from '$lib/utils'
import {
  LOGIN_MUTATION,
  CUSTOMER_QUERY,
  CUSTOMER_CREATE_MUTATION,
} from '$lib/server/data'
import { setError, superValidate } from 'sveltekit-superforms/server'
import type {
  Customer,
  CustomerAccessTokenCreatePayload,
  CustomerCreatePayload,
} from '$lib/types'
import {
  loginSchema,
  registerSchema,
  passwordSetSchema,
} from '$lib/validations'

const getCustomer = async (locals: App.Locals) => {
  const { storefront, session, locale } = locals
  const { customerAccessToken } = session.data

  const { data } = await storefront.query<{
    customer: Customer
  }>({
    query: CUSTOMER_QUERY,
    variables: {
      customerAccessToken: customerAccessToken,
      country: locale?.country || undefined,
      language: locale?.language || undefined,
    },
  })

  return data?.customer
}

const doLogin = async (locals: App.Locals, email: string, password: string) => {
  const { storefront, session } = locals

  const { data } = await storefront.mutate<{
    customerAccessTokenCreate: CustomerAccessTokenCreatePayload
  }>({
    mutation: LOGIN_MUTATION,
    variables: {
      input: { email, password },
    },
  })
  if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    return data.customerAccessTokenCreate.customerAccessToken.accessToken
  }

  throw error(400, JSON.stringify(data?.customerAccessTokenCreate?.customerUserErrors))
}

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  const { session, locale } = locals
  const { customerAccessToken } = session.data

  const isAuthenticated = !!customerAccessToken
  const customer = isAuthenticated ? await getCustomer(locals) : undefined

  // Redirect if not authenticated
  if (!customerAccessToken || !customer)
    throw redirect(302, `${useLocaleKey(locale) ? useLocaleKey(locale) : ''}/account/login`)

  // Don't cache this page
  setHeaders({'Cache-Control': 'no-store'})

  // Return as props
  return {
    props: {
      isAuthenticated,
      customer,
    },
    seo: {
      title: 'Account',
    },
  }
}

export const actions: Actions = {
  login: async ({ locals, request }) => {
    const { session } = locals
    const form = await superValidate(request, loginSchema)

    try {
      // validate form
      if (!form.valid)
        return fail(400, { form })
      const { email, password } = form.data

      // perform login
      const customerAccessToken = await doLogin(locals, email, password)
      await session.set({ 'customerAccessToken': customerAccessToken })
    } catch (err) {
      if (err instanceof Error)
        setError(form, 'password', 'Something went wrong, please try again later.')
      else
        setError(form, 'password', 'Invalid email or password.')
    }

    // return form
    return { form }
  },
  register: async ({ locals, request }) => {
    const { storefront, session } = locals
    const form = await superValidate(request, registerSchema)

    try {
      // validate form
      if (!form.valid)
        return fail(400, { form })
      const { email, password } = form.data

      // perform registration
      const { data } = await storefront.mutate<{
        customerCreate: CustomerCreatePayload
      }>({
        mutation: CUSTOMER_CREATE_MUTATION,
        variables: {
          input: { email, password },
        },
      })
      if (!data?.customerCreate?.customer?.id)
        throw error(400, JSON.stringify(data?.customerCreate?.customerUserErrors))

      // Login new customer
      const customerAccessToken = await doLogin(locals, email, password)
      await session.set({ 'customerAccessToken': customerAccessToken })

      throw redirect(302, useLocaleKey(locals.locale) + '/account')
    } catch (err) {
      if (err instanceof Error)
        setError(form, 'password', 'Something went wrong, please try again later.')
      else
        setError(form, 'password', 'Sorry. We could not create an account with this email. User might already exist, try to login instead.')
    }

    return { form }
  },
  logout: async ({ locals }) => {
    const { session } = locals
    await session.set({ 'customerAccessToken': null })
    const redirectPath = useLocaleKey(locals.locale) ? `/${useLocaleKey(locals.locale)}` : ''
    throw redirect(302, redirectPath)
  },
  edit: async ({ locals, request }) => {}, // TODO
  recover: async ({ locals, request }) => {}, // TODO
}
