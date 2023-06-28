import type { PageServerLoad } from './$types'
import { PAGE_QUERY } from '$lib/server/data'
import { error } from '@sveltejs/kit'
import type { Page } from '$lib/types'

export const load: PageServerLoad = async ({ locals, params }) => {
  const { storefront, locale } = locals
  const { language } = locale
  const { handle } = params

  const { data } = await storefront.query<{page: Page}>({
    query: PAGE_QUERY,
    variables: {
      handle,
      language,
    },
  })

  const { page } = data

  if (!page)
    throw error(404, 'Page not found')

  return {
    seo: {
      title: page?.seo?.title || page?.title,
      description: page?.seo?.description,
    },
    page,
  }
}
