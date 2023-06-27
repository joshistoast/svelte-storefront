import type { PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms/server'
import { AccountEditSchema } from '$lib/validations'
import { redirect } from '@sveltejs/kit'
import type { Customer } from '$lib/types'
import { CUSTOMER_QUERY } from '$lib/server/data'
import { useLocaleKey } from '$lib/utils'

export const load: PageServerLoad = async ({ locals }) => {
  const { session, storefront, locale } = locals
  const { customerAccessToken } = session.data
  const { country, language } = locale

  const redirectPath = `/${useLocaleKey(locale) ?? ''}/account/login`

  if (!customerAccessToken)
    throw redirect(302, redirectPath)

  const { data } = await storefront.query<{
    customer: Customer
  }>({
    query: CUSTOMER_QUERY,
    variables: {
      customerAccessToken,
      country,
      language,
    }
  })

  const { customer } = data
  if (!customer)
    throw redirect(302, redirectPath)

  const form = await superValidate(AccountEditSchema)

  form.data.firstName = customer.firstName ?? undefined
  form.data.lastName = customer.lastName ?? undefined
  form.data.email = customer.email ?? ''
  form.data.phone = customer.phone ?? undefined

  return {
    customer,
    form,
    seo: {
      title: 'Edit Account',
    },
  }
}
