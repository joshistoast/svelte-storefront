import type { PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms/server'
import {
  redirect,
} from '@sveltejs/kit'
import { useLocaleKey } from '$lib/utils'
import { loginSchema } from '$lib/validations'

export const load: PageServerLoad = async ({ locals }) => {
  const { session, locale } = locals
  const { customerAccessToken } = session.data

  if (customerAccessToken)
    throw redirect(302, `${useLocaleKey(locale) ? useLocaleKey(locale) : ''}/account`)

  const form = await superValidate(loginSchema)
  return { form }
}
