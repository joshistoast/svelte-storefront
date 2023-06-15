<script lang="ts">
import { page } from '$app/stores'

export let href: string

$: ({ selectedLocale } = $page.data)
$: locale = `${String(selectedLocale.language)?.toLocaleLowerCase()}-${String(selectedLocale.country)?.toLocaleLowerCase()}` ?? 'en-us'

$: url = locale === 'en-us' ? href : `/${locale}${href}`
</script>

<a href={url} {...$$restProps}>
  <slot />
</a>
