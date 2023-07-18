<script lang="ts">
import { page } from '$app/stores'

$: ({ seo, layout } = $page.data)
$: ({ shop } = layout)

$: title = seo?.title ? `${seo.title} | ${shop.name}` : shop.name
$: description = seo?.description || shop.description
$: robots = seo?.robots || 'index, follow'
</script>

<svelte:head>
  <title>{title}</title>

  <link rel="preconnect" href="https://cdn.shopify.com" />
  <link rel="preconnect" href="https://shop.app" />

  <meta name="description" content={description} />
  <meta name="robots" content={robots} />

  <meta name="og:title" content={title} />
  <meta name="og:description" content={description} />
  <meta name="og:type" content="website" />
  <meta name="twitter:card" content="summary" />

  {#if shop.brand?.image}
    <link rel="icon" href={shop.brand?.image?.url} />
  {/if}
</svelte:head>
