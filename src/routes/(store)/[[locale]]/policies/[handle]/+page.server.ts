import type { PageServerLoad } from "./$types";
import { POLICY_CONTENT_QUERY } from "$lib/server/data";
import invariant from "tiny-invariant";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals }) => {
  const { storefront, locale } = locals;
  const { handle } = params;

  const policyName = handle.replace(/-([a-z])/g, (_: unknown, m1: string) =>
    m1.toUpperCase(),
  ) as "privacyPolicy" | "shippingPolicy" | "termsOfService" | "refundPolicy";

  const { data } = await storefront.query({
    query: POLICY_CONTENT_QUERY,
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: locale.language,
    },
  });

  invariant(data, "No data returned from Shopify API");

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw error(404, "Policy not found");
  }

  return {
    seo: {
      title: policy.title,
      description: policy.body,
    },
    policy,
  };
};
