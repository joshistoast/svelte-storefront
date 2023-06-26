<script lang="ts">
import type { Product, MoneyV2 } from '$lib/types'
import { isDiscounted, isNewArrival } from '$lib/utils'
import Link from '$lib/components/Link.svelte'
import Money from '$lib/components/Money.svelte'
import Image from '$lib/components/Image.svelte'

export let product: Product
export let label: string | undefined = undefined
// export let quickAdd: boolean = false

const firstVariant = product.variants.nodes[0] ?? {}
const {image, price, compareAtPrice} = firstVariant

let cardLabel: string | undefined = undefined
if (label) {
  cardLabel = label
} else if (compareAtPrice && isDiscounted(price, compareAtPrice)) {
  cardLabel = 'Sale'
} else if (product.createdAt && isNewArrival(new Date(product.createdAt))) {
  cardLabel = 'New'
}

const productAnalytics = {
  productGid: product.id,
  variantGid: firstVariant.id,
  name: product.title,
  variantName: firstVariant.title,
  brand: product.vendor,
  price: firstVariant.price.amount,
  quantity: 1,
}

</script>

<Link
  href="/products/{product.handle}"
  prefetch="intent"
  class="bg-gray-100"
>

  <!-- image will go here -->
  {#if image}
    <Image
      {image}
      class="object-cover w-full"
      aspect-ratio="4/5"
    />
  {/if}

  {#if cardLabel}<span>{cardLabel}</span>{/if}
  <h3>{product.title}</h3>

  <Money withoutTrailingZeroes money={price} />
  {#if compareAtPrice && isDiscounted(price, compareAtPrice)}
    <Money withoutTrailingZeroes money={compareAtPrice} class="opacity-50" />
  {/if}

</Link>
