<script lang="ts">
import type { PageServerData } from './$types'
import { page } from '$app/stores'
import Link from '$root/lib/components/Link.svelte'
import ProductCard from '$lib/components/Product/Card.svelte'
import { goto } from '$app/navigation'

export let data: PageServerData
let { products } = data
let loading = false

$: ({
  noResultRecommendations,
  searchTerm,
} = data)
$: noResults = products?.nodes?.length === 0
$: ({ hasNextPage, endCursor } = data.products?.pageInfo || {})

// handle loading more products
const loadMore = async () => {
  if (!endCursor || !hasNextPage) return
  loading = true
  const url = new URL($page.url.href)
  url.searchParams.set('after', endCursor)
  goto(url.href, {
    replaceState: true,
    noScroll: true,
  })
  products = {
    ...products,
    nodes: [...products.nodes, ...data.products.nodes],
  }
  loading = false
}

// search value is either the search term from the search input or the query param
let searchValue = searchTerm || $page.url.searchParams.get('q') || ''
</script>

<h1>Search</h1>
<div>
  <form
    method="GET"
  >
    <input
      type="text"
      id="search"
      name="q"
      placeholder="Search..."
      bind:value={searchValue}
    />
    <button type="submit">Go</button>
  </form>
</div>

<div class="grid gap-4">
  {#if noResults && searchTerm}
    <div>
      No results for <strong>{searchTerm}</strong>, try a different search.
    </div>
  {:else if !searchTerm || noResults}
    {#if noResultRecommendations}
      <h2>Trending Collections</h2>
      <div class="grid gap-4 lg:grid-cols-3">
        {#each noResultRecommendations.featuredCollections.nodes as collection}
          <Link href="/collections/{collection.handle}">
            <div class="bg-gray-100">{collection.title}</div>
          </Link>
        {/each}
      </div>

      <h2>Trending Products</h2>
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {#each noResultRecommendations.featuredProducts.nodes as product}
          <ProductCard {product} />
        {/each}
      </div>
    {/if}
  {:else}
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {#each products.nodes as product}
        <ProductCard {product} />
      {/each}
    </div>
    {#if hasNextPage}
      <button
        type="button"
        on:click|preventDefault={loadMore}
      >
        Load{loading ? 'ing' : ''} More
      </button>
    {/if}
  {/if}
</div>
