<script lang="ts">
import type {
  ProductOption,
  ProductVariant,
  SelectedOption,
} from '$lib/types'

export let option: ProductOption
export let variants: ProductVariant[]
export let selectedVariant: ProductVariant | undefined = undefined
export let selectedOptions: SelectedOption[] = []

const newOptions = (value: string) => {
  let optionExists = false
  const n = selectedOptions?.map((o) => {
    if (o.name === option.name) {
      optionExists = true
      return { ...o, value }
    }
    return o
  })
  if (!optionExists)
    n?.push({ name: option.name, value })
  return n
}

$: optionCurrentValue = selectedOptions?.find(o => o.name === option.name)?.value
$: isOptionValueSelected = (value: string) => value === optionCurrentValue
$: isDisabled = (value: string) => {
  const newOpts = newOptions(value)
  const variantDoesNotExist = !variants.find((variant) =>
    variant.selectedOptions.every((opt) => newOpts?.find((o) => o.name === opt.name)?.value === opt.value)
  )
  const variantIsNotAvailable = variants.find((variant) =>
    variant.selectedOptions.every((opt) => newOpts?.find((o) => o.name === opt.name)?.value === opt.value)
  )?.availableForSale === false

  return variantDoesNotExist || variantIsNotAvailable
}

const selectOption = (value: string) => {
  selectedOptions = newOptions(value)
  const newVariant = variants.find((variant) =>
    variant.selectedOptions.every((opt) => selectedOptions?.find((o) => o.name === opt.name)?.value === opt.value)
  )
  if (newVariant)
    selectedVariant = newVariant
}
</script>

<div class="grid gap-4">
  <span>{option.name}</span>
  <div class="flex flex-wrap gap-2">
    {#each option.values as value}
      <button
        role="radio"
        aria-checked={isOptionValueSelected(value)}
        disabled={isDisabled(value)}
        on:click={() => selectOption(value)}
        class="{isOptionValueSelected(value) ? 'font-bold' : ''}"
      >
        {value}
      </button>
    {/each}
  </div>
</div>
