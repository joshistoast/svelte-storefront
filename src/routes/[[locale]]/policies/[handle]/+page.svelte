<script lang="ts">
import type { PageServerData } from './$types'
import LocaleLink from '$lib/components/LocaleLink.svelte'

export let data: PageServerData
$: ({ policy } = data)
</script>

<h1>{policy.title}</h1>
<LocaleLink href="/policies">Back to Policies</LocaleLink>

<div>{@html policy.body}</div>
