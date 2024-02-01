import { error } from "@sveltejs/kit";
import { PRODUCT_QUERY, recommendedProductsQuery } from "$lib/server/data";
import type { PageServerLoad } from "./$types";
import invariant from "tiny-invariant";

export const load: PageServerLoad = async ({ params, locals, setHeaders }) => {
  const { storefront, locale } = locals;
  const { handle } = params;
  invariant(handle, "Missing product handle");

  const { data } = await storefront.query({
    query: PRODUCT_QUERY,
    variables: {
      handle,
      country: locale.country,
      language: locale.language,
    },
  });
  const { product } = data;

  if (!product?.id) {
    throw error(404, "Product not found");
  }

  const firstVariant = product.variants?.nodes?.[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor ?? undefined,
    price: selectedVariant.price.amount,
  };

  const { recommended } = await storefront
    .query({
      query: recommendedProductsQuery,
      variables: {
        productId: product.id,
        count: 12,
        country: locale.country,
        language: locale.language,
      },
    })
    .then(({ data }) => ({
      recommended: data.recommended,
      additional: data.additional.nodes,
    }))
    .catch((err: Error) => {
      console.error(err.message);
      return { recommended: [], additional: [] };
    });

  const seo = {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
  };

  // Short Cache-Control to allow for quick updates
  setHeaders({
    "Cache-Control": "public, max-age=1, stale-while-revalidate=9",
  });

  return {
    product,
    recommended,
    seo,
    analytics: {
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
  };
};
