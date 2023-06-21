<script lang="ts">
import type { PageServerData } from './$types'
import { superForm } from 'sveltekit-superforms/client'
import LocaleLink from '$lib/components/LocaleLink.svelte'

export let data: PageServerData

const {
  form,
  enhance,
  errors,
  message,
  constraints,
  submitting,
} = superForm(data.form)
</script>

{#if $message === 'Account activated'}
  <h1>Account Activated</h1>
  <p>Your account has been activated.</p>
  <LocaleLink href="/account/login">Login</LocaleLink>
{:else}
  <h1>Activate Account.</h1>
  <p>Create your password to activate your account.</p>
  <form
    method="POST"
    use:enhance
    class="flex flex-col max-w-md gap-2"
  >
    <!-- svelte-ignore a11y-autofocus -->
    <input
      id="password"
      name="password"
      type="password"
      autocomplete="current-password"
      placeholder="Password"
      aria-label="Password"
      minlength="8"
      required
      autofocus
      bind:value={$form.password}
      {...$constraints.password}
    />
    {#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}

    <input
      id="confirmPassword"
      name="confirmPassword"
      type="password"
      autocomplete="current-password"
      placeholder="Confirm Password"
      aria-label="Confirm Password"
      required
      bind:value={$form.confirmPassword}
      {...$constraints.confirmPassword}
    />
    {#if $errors.confirmPassword}<span class="invalid">{$errors.confirmPassword}</span>{/if}

    <button
      type="submit"
      class="bg-gray-100 hover:bg-gray-200"
    >
      Sav{#if $submitting}ing{:else}e{/if} Password
    </button>
  </form>
{/if}

<style>
  .invalid {
    color: red;
  }
</style>
