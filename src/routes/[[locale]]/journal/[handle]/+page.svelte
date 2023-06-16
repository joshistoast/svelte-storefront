<script lang="ts">
import type { PageServerData } from './$types'

export let data: PageServerData
const { article } = data
</script>

<h1>{article.title}</h1>
<p>{article.formattedDate} • {article.author.name}</p>

<img
  src={article.image.url}
  alt={article.image.alt}
  width={article.image.width}
  height={article.image.height}
/>

<div>
  {@html article.contentHtml}
</div>
