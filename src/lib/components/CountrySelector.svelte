<script lang="ts">
import { page } from '$app/stores'
import { enhance } from '$app/forms'
import type {
  Localizations,
  Locale,
} from '$lib/types'
import { onMount } from 'svelte'
import { tick } from 'svelte'
  import { invalidateAll } from '$app/navigation'

let selectedLocale: Locale
let stagedLocale: Locale

$: ({ selectedLocale } = $page.data)
$: pathLocale = $page.params['locale'] ?? 'en-us'
$: pathWithoutLocale = $page.url.pathname.replace(`/${pathLocale}`, '')
$: pathWithStagedLocale = stagedLocale
  ? `${toLocaleString(stagedLocale.language, stagedLocale.country)}${pathWithoutLocale}`
  : undefined

let stagedBuyerIdentity: string
$: stagedBuyerIdentity = JSON.stringify({
  countryCode: stagedLocale?.country || selectedLocale?.country
})

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

const selectLocale = async (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  stagedLocale = countries[value]
  await tick()
  selectWrapper.querySelector('form')?.submit()
  await invalidateAll()
}
const toLocaleString = (languageCode: string, countryCode: string) => {
  if (!countryCode || !languageCode) return
  return `${languageCode.toLowerCase()}-${countryCode.toLowerCase()}`
}
</script>

<div bind:this={selectWrapper}>
  {#if countries}
    <form action="/cart?/UPDATE_BUYER_IDENTITY" method="POST" use:enhance>
      <select on:change={selectLocale}>
        {#each Object.entries(countries) as [ key, { label, language, country, currency }]}
          <option value={toLocaleString(language, country)} selected={country === selectedLocale.country}>
            {label}
          </option>
        {/each}
      </select>
      <input name="buyerIdentity" type="hidden" value={stagedBuyerIdentity} />
      <input name="redirectTo" type="hidden" value={pathWithStagedLocale} />
    </form>
  {/if}
</div>
