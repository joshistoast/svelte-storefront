<script lang="ts">
import type { Order } from '$lib/types'
import Link from '$lib/components/Link.svelte'
import OrderCard from '$lib/components/OrderCard.svelte'

export let orders: Order[]
</script>

<div class="bg-gray-100">
  <h2>Order History</h2>

  {#if orders.length}
    <ul class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {#each orders as order}
        <li>
          <OrderCard {order} />
        </li>
      {/each}
    </ul>
  {:else}
    <p>You haven&apos;t placed any orders yet.</p>
    <Link href="/">
      Start shopping
    </Link>
  {/if}
</div>
