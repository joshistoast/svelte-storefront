<script lang="ts">
import type { PageServerData } from './$types'
import ProductView from '$lib/components/Product/View.svelte'

export let data: PageServerData
$: ({ product } = data)
</script>

<ProductView {product} />
