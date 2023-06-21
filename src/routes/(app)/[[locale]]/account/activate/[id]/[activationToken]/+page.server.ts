import type { PageServerLoad, Actions } from './$types'
import { setError, superValidate, message } from 'sveltekit-superforms/server'
import { passwordSetSchema } from '$lib/validations'
import { fail, redirect } from '@sveltejs/kit'
import { CUSTOMER_ACTIVATE_MUTATION } from '$lib/server/data'
import type { CustomerActivatePayload } from '$lib/types'

export const load: PageServerLoad = async ({ locals }) => {

  const form = await superValidate(passwordSetSchema)

  return {
    form,
    seo: {
      title: 'Activate Account',
    }
  }
}

export const actions: Actions = {
  default: async ({ locals, params, request }) => {
    const { storefront, session } = locals
    const { id, activationToken } = params

    const form = await superValidate(request, passwordSetSchema)

    try {
      if (!form.valid)
        return fail(400, { form })
      const { password } = form.data

      const { data } = await storefront.mutate<{
        customerActivate: CustomerActivatePayload
      }>({
        mutation: CUSTOMER_ACTIVATE_MUTATION,
        variables: {
          id: `gid://shopify/Customer/${id}`,
          input: { password, activationToken }
        },
      })

      const { accessToken } = data?.customerActivate?.customerAccessToken ?? {}
      if (!accessToken) {
        data?.customerActivate?.customerUserErrors?.forEach((error) => {
          setError(form, 'confirmPassword', error.message)
        })
      }

      await session.set({ 'customerAccessToken': accessToken })
      return message(form, 'Account activated')
    } catch (err) {
      return fail(400, { form })
    }
  }
}
