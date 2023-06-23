<script lang="ts">
import type { PageServerData } from './$types'
import { page } from '$app/stores'
import { enhance } from '$app/forms'
  import LocaleLink from '$root/lib/components/LocaleLink.svelte'

export let data: PageServerData
$: ({
  products,
  noResultRecommendations,
  searchTerm,
} = data)
$: noResults = products?.nodes?.length === 0

let searchValue = searchTerm || $page.url.searchParams.get('q') || ''
</script>

<h1>Search</h1>
<div>
  <form
    method="GET"
    use:enhance
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
          <LocaleLink href="/collections/{collection.handle}">
            <div class="bg-gray-100">{collection.title}</div>
          </LocaleLink>
        {/each}
      </div>

      <h2>Trending Products</h2>
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {#each noResultRecommendations.featuredProducts.nodes as product}
          <LocaleLink href="/collections/{product.handle}">
            <div class="bg-gray-100">{product.title}</div>
          </LocaleLink>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {#each products.nodes as product}
        <LocaleLink href="/collections/{product.handle}">
          <div class="bg-gray-100">{product.title}</div>
        </LocaleLink>
      {/each}
    </div>
  {/if}
</div>
