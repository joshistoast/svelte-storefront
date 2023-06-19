<script lang="ts">
import type { PageServerData } from './$types'
import LocaleLink from '$lib/components/LocaleLink.svelte'

export let data: PageServerData
const { blog } = data
</script>

<h1>{blog.title}</h1>

<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
  {#each blog.articles as article}
    <LocaleLink href="/{blog.handle}/{article.handle}">
      <img
        src={article.image?.url}
        alt={article.image?.altText}
        width={article.image?.width}
        height={article.image?.height}
      />
      <h2>{article.title}</h2>
      <p>{article.publishedAt}</p>
    </LocaleLink>
  {/each}
</div>
