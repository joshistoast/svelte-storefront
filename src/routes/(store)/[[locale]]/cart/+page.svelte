<script lang="ts">
  import type { PageServerData, ActionData } from "./$types";
  import { applyAction, deserialize } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { CartAction } from "$lib/types";
  import QuantityUpdate from "$lib/components/Cart/QuantityUpdate.svelte";
  import Money from "$lib/components/Money.svelte";
  import Link from "$lib/components/Link.svelte";
  import Image from "$lib/components/Image.svelte";

  export let data: PageServerData;
  export let form: ActionData;

  $: ({ cart } = data);

  const handleCartAction = async (event: Event, action: CartAction) => {
    const target = event.target as HTMLFormElement;
    const body = new FormData(target);
    let response: Response;

    if (
      action === CartAction.REMOVE_FROM_CART &&
      !confirm("Are you sure you want to remove this item from your cart?")
    )
      return;

    response = await fetch(`/cart?/${action}`, {
      method: "POST",
      body,
    });

    const result = deserialize(await response.text());
    result.type === "success" && invalidateAll();
    applyAction(result);
  };
</script>

<h1>Cart - {cart?.totalQuantity ?? 0}</h1>

{#if form}
  {#each form.errors || [] as error}
    <p>{error.message}</p>
  {/each}
{/if}

{#if !cart}
  <p>Cart is empty</p>
{:else}
  {#each cart?.lines?.edges.map((e) => e.node) as line}
    {@const { id, quantity, merchandise } = line}
    {@const { selectedOptions, product } = merchandise}

    <div class="flex gap-4 p-2 bg-gray-100">
      {#if merchandise.image}
        <div class="w-24">
          <Image
            image={merchandise.image}
            class="object-cover w-full"
            aspect-ratio="1/1"
          />
        </div>
      {/if}

      <div class="flex flex-col items-start gap-2 p-2">
        <Link href="/products/{product.handle}">{product.title}</Link>
        <div class="text-sm">
          <p>
            <Money money={line.cost.amountPerQuantity} /> x {quantity || 0} = <Money
              money={line.cost.totalAmount}
            />
          </p>
          {#if merchandise.title !== "Default Title"}
            {#each selectedOptions as option}
              <p>{option.name}: {option.value}</p>
            {/each}
          {/if}
        </div>
        <form
          on:submit|preventDefault={(e) =>
            handleCartAction(e, CartAction.UPDATE_CART)}
        >
          <QuantityUpdate {line} {quantity} />
        </form>
        <form
          on:submit|preventDefault={(e) =>
            handleCartAction(e, CartAction.REMOVE_FROM_CART)}
        >
          <input type="hidden" name="lineIds" value={JSON.stringify([id])} />
          <button type="submit">Remove Item</button>
        </form>
      </div>
    </div>
  {/each}

  <div class="flex flex-col gap-4">
    <form
      on:submit|preventDefault={(e) =>
        handleCartAction(e, CartAction.UPDATE_DISCOUNT)}
    >
      {#if cart.discountCodes?.length}
        <p>Discount</p>
        {#each cart.discountCodes as discount}
          <div>
            <span>{discount.code}</span>
            <button type="submit">Remove Code</button>
          </div>
        {/each}
      {:else}
        <input type="text" name="discountCode" placeholder="Discount Code" />
        <button type="submit">Apply Discount</button>
      {/if}
    </form>
    <a href={cart.checkoutUrl}
      >Continue to Checkout - <Money money={cart.cost.subtotalAmount} /></a
    >
  </div>
{/if}
