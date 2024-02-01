<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import ProductCard from "$lib/components/Product/Card.svelte";
  import Image from "$lib/components/Image.svelte";

  export let data: PageData;
  let { collection } = data;
  let loading = false;

  $: ({ endCursor, hasNextPage } = data.collection.products.pageInfo);

  const loadMore = async () => {
    if (!endCursor || !hasNextPage || loading) return;
    loading = true;
    const url = new URL($page.url.href);
    url.searchParams.set("cursor", endCursor);
    goto(url.href, {
      replaceState: true,
      noScroll: true,
    });
    collection = {
      ...collection,
      products: {
        ...collection.products,
        nodes: [
          ...collection.products.nodes,
          ...data.collection.products.nodes,
        ],
      },
    };
    loading = false;
  };
</script>

{#if collection.image}
  <Image image={collection.image} />
{/if}

<h1>{collection.title}</h1>

<div class="grid grid-cols-6 gap-4">
  {#each collection.products.nodes as product}
    <ProductCard {product} />
  {/each}
</div>

{#if hasNextPage}
  <button disabled={loading} on:click|preventDefault={loadMore}>
    {loading ? "Loading..." : "Load more products"}
  </button>
{/if}
