<script lang="ts">
import type { MoneyV2, UnitPriceMeasurement } from '$lib/types'
import { useMoney } from '$lib/utils'
// import invariant from 'tiny-invariant'
import { page } from '$app/stores'

$: ({ selectedLocale } = $page.data)
$: locale = `${String(selectedLocale.language)?.toLocaleLowerCase()}-${String(selectedLocale.country)?.toLocaleLowerCase()}` ?? 'en-us'

/** A [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2). */
export let money: MoneyV2
/** Whether to remove trailing zeros (fractional money) from the output. */
export let withoutTrailingZeros = false
/** Whether to remove the currency symbol from the output. */
export let withoutCurrency = false
/** A [UnitPriceMeasurement object](https://shopify.dev/api/storefront/latest/objects/unitpricemeasurement). */
export let measurement: UnitPriceMeasurement | undefined = undefined

const isMoney = (maybeMoney: any): maybeMoney is MoneyV2 => {
  return (
    typeof maybeMoney.amount === 'string' && !!maybeMoney.amount &&
    typeof maybeMoney.currencyCode === 'string' && !!maybeMoney.currencyCode
  )
}

if (!isMoney(money)) {
  throw new Error('The `money` prop must be a MoneyV2 object.')
}

$: moneyObj = useMoney(locale, money)
let output: string
$: output = moneyObj.localizedString

$: if (withoutCurrency || withoutTrailingZeros) {
  if (withoutCurrency && !withoutTrailingZeros) {
    output = moneyObj.amount
  } else if (!withoutCurrency && withoutTrailingZeros) {
    output = moneyObj.withoutTrailingZeros
  } else {
    output = moneyObj.withoutTrailingZeroesAndCurrency
  }
}
</script>
<div {...$$restProps} class="inline {$$restProps.class}">
  <span>{output}</span>
  {#if measurement && measurement.referenceUnit}
    <slot name="measurement-separator" />
    <span>{measurement.referenceUnit}</span>
  {/if}
</div>
