<script lang="ts">
import type { Image } from '$lib/types'
import { parseAspectRatio } from '$lib/utils'

type Crop = 'center' | 'top' | 'bottom' | 'left' | 'right'
export let image: Image
export let aspectRatio: string = '4/5'
export let sizes: string = '(min-width: 45em) 50vw, 100vw'
export let crop: Crop = 'center'

let intervals = 15
let startingWidth = 200
let incrementSize = 200
let placeholderWidth = 100
let placeholderHeight = aspectRatio ? placeholderWidth * (parseAspectRatio(aspectRatio) ?? 1) : undefined
let decoding: 'async' | 'auto' | 'sync' | null | undefined = 'async'
let alt: string = image.altText ?? ''
let width: string = '100%'

const imageWidths = Array.from(
  { length: intervals },
  (_, i) => i * incrementSize + startingWidth
)
type LoaderParams = {
  src: string
  width?: number
  height?: number
  crop?: Crop
}
const imageLoader = ({ src, width, height, crop }: LoaderParams) => {
  if (!src) return ''
  const url = new URL(src)
  width && url.searchParams.append('width', Math.round(width).toString())
  height && url.searchParams.append('height', Math.round(height).toString())
  crop && url.searchParams.append('crop', crop)

  return url.href
}

const generateSrcSet = (
  src?: string,
  sizesArray?: Array<{width?: number; height?: number; crop?: Crop}>
) => {
  if (!src) return ''
  if (!sizesArray) return src

  return sizesArray.map((size, i) =>
    `${imageLoader({
      src,
      width: size.width,
      height: size.height,
      crop: size.crop,
    })} ${sizesArray.length === 3 ? `${i + 1}x` : `${size.width ?? 0}w`}`,
  ).join(`, `)
}
const generateSizes = (
  imageWidths?: number[],
  aspectRatio?: string,
  crop: Crop = 'center',
) => {
  if (!imageWidths) return
  return imageWidths.map((width) => {
    return {
      width,
      height: aspectRatio ? width * (parseAspectRatio(aspectRatio) ?? 1) : undefined,
      crop,
    }
  })
}

const sizesArray = imageWidths === undefined ? undefined : generateSizes(imageWidths, aspectRatio, crop)
const srcSet = generateSrcSet(image.url, sizesArray)
const src = imageLoader({
  src: image.url,
  width: placeholderWidth,
  height: placeholderHeight,
  crop,
})

</script>

<img
  {src}
  srcset={srcSet}
  width={placeholderWidth}
  height={placeholderHeight}
  {decoding}
  {alt}
  style="
    width: {width};
    aspect-ratio: {aspectRatio};
    {$$props.style}
  "
  {...$$restProps}
/>
