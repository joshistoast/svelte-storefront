import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getCartId } from "$lib/utils";
import type {
  CartCreatePayload,
  CartDiscountCodesUpdatePayload,
} from "$lib/types";
import { CREATE_CART_MUTATION, DISCOUNT_CODES_UPDATE } from "$lib/server/data";

export const load: PageServerLoad = async ({
  params,
  locals,
  url,
  request,
  cookies,
  setHeaders,
}) => {
  const { storefront, locale } = locals;
  const { code } = params;
  const redirectTo = url.searchParams.get("redirectTo") ?? "/";
  let cartId = getCartId(request);
  const discountCodes = [code];

  if (!cartId) {
    // create a cart
    const { data } = await storefront.mutate<{
      cartCreate: CartCreatePayload;
    }>({
      mutation: CREATE_CART_MUTATION,
      variables: {
        input: {
          discountCodes,
          country: locale?.country || undefined,
          language: locale?.language || undefined,
        },
      },
    });
    const { cart, userErrors } = data?.cartCreate || {};

    if (userErrors?.length) throw redirect(302, redirectTo);

    cartId = cart?.id;
    if (cartId) cookies.set("cart", `${cartId.split("/").pop()}`);
  } else {
    await storefront.mutate<{
      cartDiscountCodesUpdate: CartDiscountCodesUpdatePayload;
    }>({
      mutation: DISCOUNT_CODES_UPDATE,
      variables: { cartId, discountCodes },
    });
  }

  // don't cache this page
  setHeaders({
    "cache-control": "no-store",
  });

  throw redirect(302, redirectTo);
};
