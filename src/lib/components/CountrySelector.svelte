<script lang="ts">
import {
  CartAction,
  type Localizations,
  type Locale,
  type CartBuyerIdentityInput,
} from '$lib/types'
import { DEFAULT_LOCALE } from '$lib/utils'

const countries = fetch('/api/countries')

</script>
