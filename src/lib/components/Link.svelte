<script lang="ts">
import { page } from '$app/stores'

export let href: string

$: currentPath = $page.url
$: ({ selectedLocale, layout } = $page.data)
$: locale = `${String(selectedLocale.language)?.toLocaleLowerCase()}-${String(selectedLocale.country)?.toLocaleLowerCase()}` ?? 'en-us'
$: isAbsoluteUrl = href.startsWith('http://') || href.startsWith('https://')
$: url = locale === 'en-us' ? new URL(href, currentPath) : (isAbsoluteUrl ? new URL(href) : new URL(`/${locale}${href}`, currentPath))
$: shopHost = new URL(layout.shop.primaryDomain.url).host

// remove shop host from url if it's there
$: finalHref = url.host === shopHost ? url.pathname : url.href

</script>

<a href={finalHref} {...$$restProps}>
  <slot />
</a>
