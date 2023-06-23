<script lang="ts">
import { superForm } from 'sveltekit-superforms/client'
import type { PageServerData } from './$types'

export let data: PageServerData

const {
  form,
  enhance,
  errors,
  constraints,
  submitting,
} = superForm(data.form, {
  invalidateAll: true,
  resetForm: true,
  taintedMessage: 'Do you want to leave this page? Changes you made may not be saved.',
})
</script>

<form
  method="POST"
  class="flex flex-col max-w-md gap-2"
  use:enhance
  action="/account?/edit"
>
  <p>Edit your profile</p>
  <input
    id="firstName"
    name="firstName"
    type="text"
    autocomplete="given-name"
    placeholder="First name"
    aria-label="First name"
    bind:value={$form.firstName}
    {...$constraints.firstName}
  />
  {#if $errors.firstName}<span class="invalid">{$errors.firstName}</span>{/if}

  <input
    id="lastName"
    name="lastName"
    type="text"
    autocomplete="family-name"
    placeholder="Last name"
    aria-label="Last name"
    bind:value={$form.lastName}
    {...$constraints.lastName}
  />
  {#if $errors.lastName}<span class="invalid">{$errors.lastName}</span>{/if}

  <input
    id="phone"
    name="phone"
    type="tel"
    autocomplete="tel"
    placeholder="Phone number"
    aria-label="Phone number"
    bind:value={$form.phone}
    {...$constraints.phone}
  />
  {#if $errors.phone}<span class="invalid">{$errors.phone}</span>{/if}

  <input
    id="email"
    name="email"
    type="email"
    autocomplete="email"
    placeholder="Email address"
    aria-label="Email address"
    bind:value={$form.email}
    {...$constraints.email}
  />
  {#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

  <p>Change your password</p>
  <input
    id="currentPassword"
    name="currentPassword"
    type="password"
    autocomplete="current-password"
    placeholder="Current Password"
    aria-label="Current Password"
    bind:value={$form.currentPassword}
    {...$constraints.currentPassword}
  />
  {#if $errors.currentPassword}<span class="invalid">{$errors.currentPassword}</span>{/if}

  <input
    id="newPassword"
    name="newPassword"
    type="password"
    autocomplete="new-password"
    placeholder="New Password"
    aria-label="New Password"
    bind:value={$form.newPassword}
    {...$constraints.newPassword}
  />
  {#if $errors.newPassword}<span class="invalid">{$errors.newPassword}</span>{/if}

  <input
    id="confirmPassword"
    name="confirmPassword"
    type="password"
    autocomplete="new-password"
    placeholder="Confirm Password"
    aria-label="Confirm Password"
    bind:value={$form.confirmPassword}
    {...$constraints.confirmPassword}
  />
  {#if $errors.confirmPassword}<span class="invalid">{$errors.confirmPassword}</span>{/if}

  <button type="submit" class="bg-gray-100 hover:bg-gray-200">
    Sav{#if $submitting}ing{:else}e{/if}
  </button>
</form>

<style>
  .invalid {
    color: red;
  }
</style>
