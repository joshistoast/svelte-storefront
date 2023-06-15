<script lang="ts">
import type { LayoutServerData } from './$types'
import HeadTemplate from '$lib/components/HeadTemplate.svelte'
import CountrySelector from '$lib/components/CountrySelector.svelte'
import LocaleLink from '$lib/components/LocaleLink.svelte'
import '../../app.css'

export let data: LayoutServerData

$: ({ shop, cart } = data.layout)
</script>
<HeadTemplate />

<header>
  <h1>{shop.name}</h1>
  <LocaleLink href="/cart">Cart - {cart?.totalQuantity ?? 0}</LocaleLink>
</header>

<main class="flex-1">
  <slot />
</main>

<footer class="p-4 bg-gray-100">
  <CountrySelector />
</footer>

<style lang="postcss">
:global(body) {
  @apply flex flex-col min-h-screen;
}
</style>
