import type { PageServerLoad } from './$types'
import { z } from 'zod'
import { superValidate } from 'sveltekit-superforms/server'
import {
  redirect,
} from '@sveltejs/kit'
import { useLocaleKey } from '$lib/utils'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const load: PageServerLoad = async ({ locals }) => {
  const { session, locale } = locals
  const { customerAccessToken } = session.data

  if (customerAccessToken)
    throw redirect(302, `${useLocaleKey(locale) ? useLocaleKey(locale) : ''}/account`)

  const form = await superValidate(loginSchema)
  return { form }
}
