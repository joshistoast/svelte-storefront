<script lang="ts">
import type { Maybe, CartLine } from '$lib/types'
import { tick } from 'svelte'

export let line: CartLine
export let quantity: number
export let maxQuantity: number | undefined | Maybe<number> = undefined
export let step: number = 1

const decrement = async () => {
  if (quantity - step <= 0) return
  quantity -= step
  await tick()
}

const increment = async () => {
  if (maxQuantity && quantity + step > maxQuantity) return
  quantity += step
  await tick()
}
</script>

<input type="hidden" name="quantity" value={quantity} />
<input type="hidden" name="lines" value={JSON.stringify([{ id: line.id, quantity }])} />

<div class="flex items-center">
  <button type="submit" class="w-6 h-6" on:click={decrement}>-</button>
  <span class="px-2 text-center">{quantity}</span>
  <button type="submit" class="w-6 h-6" disabled={maxQuantity === quantity + 1} on:click={increment}>+</button>
</div>
