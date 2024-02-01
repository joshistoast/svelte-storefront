import type { PageServerLoad } from "./$types";
import { ARTICLE_QUERY } from "$lib/server/data";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { storefront, locale } = locals;
  const { language, country } = locale;

  const blogHandle = "journal";
  const { handle: articleHandle } = params;

  const { data } = await storefront.query({
    query: ARTICLE_QUERY,
    variables: {
      blogHandle,
      articleHandle,
      language,
    },
  });

  if (!data?.blog?.articleByHandle) throw error(404, "Article not found");

  const article = data.blog.articleByHandle;

  const formattedDate = new Intl.DateTimeFormat(`${language}-${country}`, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(article?.publishedAt));

  return {
    seo: {
      title: article?.seo?.title || article?.title,
      description: article?.seo?.description,
    },
    article: {
      ...article,
      formattedDate,
    },
  };
};
