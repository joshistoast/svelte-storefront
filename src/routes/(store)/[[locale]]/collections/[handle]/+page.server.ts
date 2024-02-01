import { collectionQuery } from "$lib/server/data";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, url, locals }) => {
  const { handle } = params;
  const { storefront, locale } = locals;

  const paginationSize = 8;
  const cursor = url.searchParams.get("cursor");
  const filters = undefined;
  const sortKey = url.searchParams.get("sort") || "CREATED";
  const reverse = url.searchParams.get("reverse") === "true";

  const variables = {
    country: locale.country,
    language: locale.language,
    handle,
    pageBy: paginationSize,
    cursor,
    filters,
    sortKey,
    reverse,
  };

  const { data } = await storefront.query({
    query: collectionQuery,
    variables,
  });

  if (!data.collection?.id) {
    throw error(404, "Collection not found");
  }

  const seo = {
    ...data.collection.seo,
    title: data.collection.seo.title || data.collection.title,
    description: data.collection.seo.description || data.collection.description,
  };

  return {
    collection: data.collection,
    seo,
  };
};
