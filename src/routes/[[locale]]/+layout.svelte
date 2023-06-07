<script lang="ts">
import type { LayoutServerData } from './$types'
import HeadTemplate from '$lib/components/HeadTemplate.svelte'
import CountrySelector from '$lib/components/CountrySelector.svelte'
import '../../app.css'

export let data: LayoutServerData

$: ({ shop, cart } = data.layout)
</script>
<HeadTemplate />

<header>
  <h1>{shop.name}</h1>
  <a href="/cart">Cart - {cart?.totalQuantity ?? 0}</a>
</header>

<main class="flex-1">
  <slot />
</main>

<footer>
  <CountrySelector />
</footer>

<style lang="postcss">
:global(body) {
  @apply flex flex-col min-h-screen;
}
</style>
