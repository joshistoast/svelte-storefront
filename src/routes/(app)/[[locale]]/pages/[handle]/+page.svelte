<script lang="ts">
import type { PageServerData } from './$types'

export let data: PageServerData
const { page } = data
</script>

<h1>{page.title}</h1>

<div>
  {@html page.body}
</div>
