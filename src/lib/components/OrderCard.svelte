<script lang="ts">
import type { Order } from '$lib/types'
import Link from '$root/lib/components/Link.svelte'

export let order: Order

const [legacyOrderId, key] = order!.id!.split('/').pop()!.split('?')
const lineItems = order!.lineItems!.edges!.map((edge) => edge!.node!)
</script>

<Link
  prefetch="intent"
  href="/account/orders/{legacyOrderId}?{key}"
>
  <h3>
    {lineItems.length > 1
      ? `${lineItems.length} items`
      : lineItems[0].title
    }
  </h3>
  <dl>
    <dt>Order ID</dt>
    <dd>{order.orderNumber}</dd>

    <dt>Order Date</dt>
    <dd>{new Date(order.processedAt).toDateString()}</dd>

    <dt>Fulfillment Status</dt>
    <dd>{order.fulfillmentStatus}</dd>
  </dl>
</Link>
