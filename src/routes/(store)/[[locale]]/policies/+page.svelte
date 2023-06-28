<script lang="ts">
import type { PageServerData } from './$types'
import Link from '$root/lib/components/Link.svelte'

export let data: PageServerData
const { policies } = data
</script>

{#each policies as policy}
  {#if policy.title}
    <Link href="/policies/{policy.handle}">
      <h2>{policy.title}</h2>
    </Link>
  {/if}
{/each}
