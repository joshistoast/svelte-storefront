<script lang="ts">
import type { LayoutServerData } from './$types'
import HeadTemplate from '$lib/components/HeadTemplate.svelte'
import CountrySelector from '$lib/components/CountrySelector.svelte'
import Link from '$root/lib/components/Link.svelte'
import '$root/app.css'

export let data: LayoutServerData

$: ({ shop, cart, headerMenu, footerMenu } = data.layout)
</script>
<HeadTemplate />

<header class="flex flex-col justify-between p-1 bg-gray-100 lg:flex-row lg:items-center lg:gap-5">
  <div class="flex flex-col lg:flex-row lg:items-center lg:gap-5">
    <a href="/">
      {shop?.name ?? 'Shopify Store'}
    </a>
    <nav class="flex items-center gap-2">
      {#each headerMenu.items as item}
      <a href={item.url}>{item.title}</a>
      {/each}
    </nav>
  </div>
  <div class="flex items-center gap-2">
    <Link href="/search">Search</Link>
    <Link href="/account">Account</Link>
    <Link href="/cart">Cart - {cart?.totalQuantity ?? 0}</Link>
  </div>
</header>

<main class="flex-1">
  <slot />
</main>

<footer class="flex flex-col gap-5 p-4 bg-gray-100">
  <nav class="flex items-center gap-2">
    {#each footerMenu.items as item}
    <a href={item.url}>{item.title}</a>
    {/each}
  </nav>
  <CountrySelector />
</footer>

<style lang="postcss">
:global(body) {
  @apply flex flex-col min-h-screen;
}
</style>
