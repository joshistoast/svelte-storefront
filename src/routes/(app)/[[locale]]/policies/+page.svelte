<script lang="ts">
import type { PageServerData } from './$types'
import LocaleLink from '$lib/components/LocaleLink.svelte'

export let data: PageServerData
const { policies } = data
</script>

{#each policies as policy}
  {#if policy.title}
    <LocaleLink href="/policies/{policy.handle}">
      <h2>{policy.title}</h2>
    </LocaleLink>
  {/if}
{/each}
