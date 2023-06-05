<script lang="ts">
import Option from '$lib/components/Product/Option.svelte'
import type {
  ProductOption,
  ProductVariant,
  SelectedOption,
} from '$lib/types'

export let options: ProductOption[] = []
export let variants: ProductVariant[] = []
export let selectedVariant: ProductVariant | undefined = variants.length === 1 ? variants[0] : undefined

let selectedOptions: SelectedOption[] | undefined = undefined
$: selectedOptions = selectedVariant?.selectedOptions || undefined
</script>

{#each options.filter((option) => option.values.length > 1) as option (option.id)}
  <Option
    {option}
    {variants}
    {selectedOptions}
    bind:selectedVariant={selectedVariant}
  />
{/each}
