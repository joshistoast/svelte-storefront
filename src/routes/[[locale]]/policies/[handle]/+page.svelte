<script lang="ts">
import type { PageServerData } from './$types'

export let data: PageServerData
$: ({ policy } = data)
</script>

<h1>{policy.title}</h1>
<div>{@html policy.body}</div>
