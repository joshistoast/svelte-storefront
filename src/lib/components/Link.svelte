<script lang="ts">
import { page } from '$app/stores'

export let href: string

$: currentPath = $page.url
$: ({ selectedLocale, layout } = $page.data)
$: locale = `${String(selectedLocale.language)?.toLocaleLowerCase()}-${String(selectedLocale.country)?.toLocaleLowerCase()}` ?? 'en-us'
$: url = locale === 'en-us' ? new URL(href, currentPath) : new URL(`/${locale}${href}`)
$: shopHost = new URL(layout.shop.primaryDomain.url).host

// remove shop host from url if it's there
$: finalHref = url.host === shopHost ? url.pathname : url.href

</script>

<a href={finalHref} {...$$restProps}>
  <slot />
</a>
