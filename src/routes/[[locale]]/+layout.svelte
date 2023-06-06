<script lang="ts">
import type { LayoutServerData } from './$types'
import HeadTemplate from '$lib/components/HeadTemplate.svelte'
import '../../app.css'

export let data: LayoutServerData

$: ({ shop, cart } = data.layout)
</script>
<HeadTemplate />

<header>
  <h1>{shop.name}</h1>
  <a href="/cart">Cart - {cart?.totalQuantity ?? 0}</a>
</header>

<main>
  <slot />
</main>
