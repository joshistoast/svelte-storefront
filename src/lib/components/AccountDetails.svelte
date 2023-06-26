<script lang="ts">
import type { Customer } from '$lib/types'
import Link from '$lib/components/Link.svelte'

export let customer: Customer
$: ({ firstName, lastName, email, phone } = customer)
</script>

<div class="flex flex-col gap-2 bg-gray-100">
  <div class="flex items-center">
    <h3>Profile & Security</h3>
    <Link href="/account/edit" class="ml-auto">
      Edit
    </Link>
  </div>

  <div>
    <p>Name</p>
    <p>
      {firstName || lastName
        ? (firstName ? firstName + ' ' : '') + lastName
        : 'Add name'}{' '}
    </p>
  </div>

  <div>
    <p>Contact</p>
    <p>{phone ?? 'Add mobile'}</p>
  </div>

  <div>
    <p>Email</p>
    <p>{email}</p>
  </div>

  <div>
    <p>Password</p>
    <p>********</p>
  </div>

</div>
