<script lang="ts">
import { enhance } from '$app/forms'
import type { PageServerData } from './$types'
import AccountDetails from '$lib/components/AccountDetails.svelte'
import AccountOrderHistory from '$lib/components/AccountOrderHistory.svelte'

export let data: PageServerData
const { customer } = data
const orders = customer.orders.edges.map((edge) => edge.node)

const heading = customer ?
  customer.firstName
    ? `Welcome, ${customer.firstName}`
    : 'Welcome to your account'
  : 'Account details'
</script>

<div class="grid w-full max-w-md gap-4">
  <h1>{heading}</h1>
  <form action="/account?/logout" method="POST" use:enhance>
    <button type="submit">Logout</button>
  </form>

  <AccountOrderHistory {orders} />
  <AccountDetails {customer} />
</div>
