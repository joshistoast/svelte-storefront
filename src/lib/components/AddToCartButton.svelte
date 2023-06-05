<script lang="ts">
import type { CartLineInput } from '$lib/types'
import { applyAction, deserialize } from '$app/forms'
import { page } from '$app/stores'
  import { invalidateAll } from '$app/navigation'

export let lines: CartLineInput[] = []
export let disabled = false

$: ({ selectedLocale } = $page.data)

let status = 'idle'
$: label = {
  idle: 'Add To Cart',
  adding: 'Adding...',
  added: 'Added',
  error: 'Could\'nt add to cart',
}[status]

const handleSubmit = async (event: Event) => {
  status = 'adding'
  const data = new FormData(event.target as HTMLFormElement)
  const response = await fetch('/cart?/ADD_TO_CART', {
    method: 'POST',
    body: data,
  })
  const result = deserialize(await response.text())
  if (result.type === 'success') {
    status = 'added'
    invalidateAll()
  }
  applyAction(result)
  setTimeout(() => {
    status = 'idle'
  }, 1750)
}
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input type="hidden" name="lines" value={JSON.stringify(lines)} />
  <input type="hidden" name="countryCode" value={selectedLocale.country} />

  <button
    type="submit"
    {disabled}
  >
    {label}
  </button>
</form>
