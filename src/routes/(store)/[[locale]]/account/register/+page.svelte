<script lang="ts">
import type { PageServerData } from './$types'
import { superForm } from 'sveltekit-superforms/client'
import Link from '$lib/components/Link.svelte'

export let data: PageServerData

const {
  form,
  enhance,
  errors,
  constraints,
  submitting,
} = superForm(data.form)
</script>

<div>
  <h1>Register</h1>

  <form
    method="POST"
    action="/account?/register"
    use:enhance
    class="flex flex-col max-w-md gap-2"
  >
    <!-- svelte-ignore a11y-autofocus -->
    <input
      type="text"
      id="email"
      name="email"
      autocomplete="email"
      required
      placeholder="Email address"
      aria-label="Email address"
      autofocus
      aria-invalid={$errors.email ? 'true' : undefined}
      bind:value={$form.email}
      {...$constraints.email}
    />
    {#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
    <input
      type="password"
      id="password"
      name="password"
      autocomplete="current-password"
      required
      minlength="8"
      placeholder="Password"
      aria-label="Password"
      aria-invalid={$errors.password ? 'true' : undefined}
      bind:value={$form.password}
      {...$constraints.password}
    />
    {#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}

    <button type="submit" class="bg-gray-100 hover:bg-gray-200">
      Creat{#if $submitting}ting{:else}e {/if} account
    </button>

    <p>Already have an account? <Link href="/account/login">Log in</Link></p>
  </form>
</div>

<style>
  .invalid {
    color: red;
  }
</style>
