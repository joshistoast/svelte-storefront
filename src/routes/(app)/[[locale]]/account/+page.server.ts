import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { useLocaleKey } from '$lib/utils'
import { LOGIN_MUTATION, CUSTOMER_QUERY } from '$lib/server/data'
import { setError, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import type { Customer, CustomerAccessTokenCreatePayload } from '$lib/types'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

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
    const { storefront, session } = locals

    // validate form
    const form = await superValidate(request, loginSchema)
    if (!form.valid)
      return fail(400, { form })
    const { email, password } = form.data

    // perform login
    const { data } = await storefront.mutate<{
      customerAccessTokenCreate: CustomerAccessTokenCreatePayload
    }>({
      mutation: LOGIN_MUTATION,
      variables: {
        input: { email, password },
      },
    })

    // set session or fail
    if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      await session.set({ 'customerAccessToken': data.customerAccessTokenCreate.customerAccessToken.accessToken })
    } else {
      data?.customerAccessTokenCreate?.customerUserErrors?.forEach(({ message }) => {
        let field: 'email' | 'password' = 'email'
        let stagedMessage = message

        switch (message) {
          case 'Unidentified customer':
            stagedMessage = 'Invalid email or password'
            field = 'password'
            break
          default:
            break
        }

        setError(form, field, stagedMessage)
      })
    }

    // return form
    return { form }
  },
  logout: async ({ locals }) => {
    const { session } = locals
    await session.set({ 'customerAccessToken': null })
    const redirectPath = useLocaleKey(locals.locale) ? `/${useLocaleKey(locals.locale) }` : ''
    throw redirect(302, redirectPath)
  },
  register: async ({ locals, request }) => {}, // TODO
  edit: async ({ locals, request }) => {}, // TODO
  recover: async ({ locals, request }) => {}, // TODO
  activate: async ({ locals, request }) => {}, // TODO
}
