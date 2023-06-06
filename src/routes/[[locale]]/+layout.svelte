<script lang="ts">
import type { LayoutServerData } from './$types'
import HeadTemplate from '$lib/components/HeadTemplate.svelte'
import '../../app.css'

export let data: LayoutServerData

$: ({ layout } = data)
</script>
<HeadTemplate />

<header>
  <h1>{layout.shop.name}</h1>
  <a href="/cart">Cart</a>
</header>

<main>
  <slot />
</main>
