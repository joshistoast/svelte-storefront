import type { PageServerLoad } from "./$types";
import type { Blog } from "$lib/types";
import { BLOGS_QUERY } from "$lib/server/data";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  const { storefront, locale } = locals;
  const { language, country } = locale;

  const BLOG_HANDLE = "journal";
  const PAGINATION_SIZE = 10;

  const { data } = await storefront.query<{ blog: Blog }>({
    query: BLOGS_QUERY,
    variables: {
      blogHandle: BLOG_HANDLE,
      pageBy: PAGINATION_SIZE,
      language,
    },
  });

  const blog = data?.blog;

  if (!blog) throw error(404, "Blog not found");

  const articles = blog.articles.edges.map((a) => {
    const { node: article } = a;
    const { publishedAt } = article;

    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat(`${language}-${country}`, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(publishedAt!)),
    };
  });

  return {
    seo: {
      title: blog?.seo?.title || blog?.title,
      description: blog?.seo?.description,
    },
    blog: {
      ...blog,
      articles,
    },
  };
};
