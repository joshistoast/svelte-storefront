import type { PageServerLoad } from "./$types";
import { POLICIES_QUERY } from "$lib/server/data";
import invariant from "tiny-invariant";
import type { Shop, NonNullableFields, ShopPolicy } from "$lib/types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  const { storefront } = locals;

  const { data } = await storefront.query<{ shop: Shop }>({
    query: POLICIES_QUERY,
  });
  invariant(data, "No data returned from shopify API");

  const { shop } = data;

  const policies = Object.values(shop as NonNullableFields<typeof shop>).filter(
    Boolean,
  ) as ShopPolicy[];

  if (!policies.length) throw error(404, "No policies found");

  return {
    seo: {
      title: "Policies",
    },
    policies,
  };
};
