<script lang="ts">
import Image from '$lib/components/Image.svelte'
import type { MediaConnection } from '$lib/types'

export let media: MediaConnection['nodes'] = []

</script>

{#each media as med, i}
  {@const isFirst = i === 0}
  {@const isFourth = i === 3}
  {@const isFullWidth = i % 3 === 0}
  {@const image = med.__typename === 'MediaImage'
    ? {...med.image, altText: med.alt || 'Product image'}
    : undefined
  }
  {@const style = [
    isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
      isFirst || isFourth ? '' : 'md:aspect-[4/5]',
      'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
    ].join(' ')
  }

  <div class={style}>
    {#if image}
      <Image
        {image}
        aspectRatio={!isFirst && !isFourth ? '4/5' : undefined}
        sizes={
          isFirst || isFourth
            ? '(min-width: 48em) 60vw, 90vw'
            : '(min-width: 48em) 30vw, 90vw'
        }
        class="object-cover w-full h-full aspect-square"
      />
    {/if}
  </div>

{/each}
