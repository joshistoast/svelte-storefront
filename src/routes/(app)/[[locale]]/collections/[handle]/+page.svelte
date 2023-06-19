<script lang="ts">
import type { PageData } from './$types'
import { page } from '$app/stores'
import { goto } from '$app/navigation'
import LocaleLink from '$lib/components/LocaleLink.svelte'

export let data: PageData

let collection = data.collection
let loading = false

$: urlCursor = $page.url.searchParams.get('cursor')
$: ({ endCursor, hasNextPage } = data.collection.products.pageInfo)
$: {
  collection = {
    ...collection,
    products: {
      ...collection.products,
      nodes: urlCursor
        ? [...collection.products.nodes, ...data.collection.products.nodes]
        : data.collection.products.nodes,
    }
  }
}

const loadMore = async () => {
  if (!endCursor || !hasNextPage || loading) return
  loading = true
  const url = new URL($page.url.href)
  url.searchParams.set('cursor', endCursor)
  goto(url.href, {
    replaceState: true,
    noScroll: true,
  })
  loading = false
}
</script>

<div class="grid grid-cols-6 gap-4">
  {#each collection.products.nodes as product}
    <LocaleLink href="/products/{product.handle}" class="bg-gray-100">
      {product.title}
    </LocaleLink>
  {/each}
</div>

{#if hasNextPage}
  <button disabled={loading} on:click|preventDefault={loadMore}>
    { loading ? 'Loading...' : 'Load more products' }
  </button>
{/if}
