<script lang="ts">
import type { PageServerData } from './$types'
import Link from '$root/lib/components/Link.svelte'

export let data: PageServerData
$: ({ policy } = data)
</script>

<h1>{policy.title}</h1>
<Link href="/policies">Back to Policies</Link>

<div>{@html policy.body}</div>
