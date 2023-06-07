<script lang="ts">
import { page } from '$app/stores'
import type {
  Localizations,
  Locale,
} from '$lib/types'
import { onMount } from 'svelte'

let selectedLocale: Locale
$: ({ selectedLocale } = $page.data)

let selectWrapper: HTMLDivElement
let countries: Localizations
let observer: IntersectionObserver

// disconnect observer if countries is set
$: !!countries && observer.disconnect()

// on client fetch countries when selectWrapper is in view
onMount(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting)
        countries = await fetchCountries()
    })
  })

  // don't fetch again if already fetched
  if (countries) return
    observer.observe(selectWrapper)

  // disconnect observer when component is destroyed
  return () => observer.disconnect()
})

const fetchCountries = async () => {
  const response = await fetch('/api/countries')
  return await response.json()
}
</script>

<div bind:this={selectWrapper}>
  everything here
  {#if countries}
    <select>
      {#each Object.entries(countries) as [ key, { label, language, country, currency }]}
        <option value={country} selected={country === selectedLocale.country}>
          {label}
        </option>
      {/each}
    </select>
  {/if}
</div>
