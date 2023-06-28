<script lang="ts">
import type { Product, ProductVariant, CartLineInput } from '$lib/types'
import ProductOptions from '$lib/components/Product/Options.svelte'
import AddToCartButton from '$lib/components/AddToCartButton.svelte'
import Money from '$lib/components/Money.svelte'
import Image from '$lib/components/Image.svelte'
import ProductGallery from '$lib/components/Product/Gallery.svelte'

export let product: Product
export let selectedVariant: ProductVariant | undefined = undefined

let cartLines: CartLineInput[] = []
$: cartLines = selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1 }] : []
</script>

<ProductGallery media={product.media.nodes} />

<h1>{product.title}</h1>
{#if selectedVariant}
  <Money money={selectedVariant.price} />
{/if}

<ProductOptions
  options={product.options}
  variants={product.variants.nodes}
  bind:selectedVariant={selectedVariant}
/>

<AddToCartButton
  lines={cartLines}
/>
