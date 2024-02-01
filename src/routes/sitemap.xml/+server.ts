import type { RequestHandler } from "./$types";
import invariant from "tiny-invariant";
import { SITEMAP_QUERY } from "$lib/server/data";
import type { Product, Maybe, Image, Collection, Page } from "$lib/types";

export type SitemapsQuery = {
  products: {
    nodes: Array<
      Pick<Product, "updatedAt" | "handle" | "onlineStoreUrl" | "title"> & {
        featuredImage?: Maybe<Pick<Image, "url" | "altText">>;
      }
    >;
  };
  collections: {
    nodes: Array<Pick<Collection, "updatedAt" | "handle" | "onlineStoreUrl">>;
  };
  pages: {
    nodes: Array<Pick<Page, "updatedAt" | "handle" | "onlineStoreUrl">>;
  };
};

export const GET = (async ({ locals, request }) => {
  const { storefront, locale } = locals;

  const maxUrls = 250; // the google limit is 50K, however, SF API only allow querying for 250 resources each time

  interface ProductEntry {
    url: string;
    lastMod: string;
    changeFreq: string;
    image?: {
      url: string;
      title?: string;
      caption?: string;
    };
  }

  const { data } = await storefront.query({
    query: SITEMAP_QUERY,
    variables: {
      urlLimits: maxUrls,
      language: locale.language,
    },
  });
  invariant(data, "Sitemap data is missing");

  const xmlEncode = (string: string) => {
    return string.replace(/[&<>'"]/g, (char) => `&#${char.charCodeAt(0)};`);
  };

  const renderUrlTag = ({
    url,
    lastMod,
    changeFreq,
    image,
  }: {
    url: string;
    lastMod?: string;
    changeFreq?: string;
    image?: {
      url: string;
      title?: string;
      caption?: string;
    };
  }) => {
    return `
      <url>
        <loc>${url}</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>${changeFreq}</changefreq>
        ${
          image
            ? `
            <image:image>
              <image:loc>${image.url}</image:loc>
              <image:title>${image.title ?? ""}</image:title>
              <image:caption>${image.caption ?? ""}</image:caption>
            </image:image>
          `
            : ""
        }
      </url>
    `;
  };

  const shopSitemap = (data: SitemapsQuery, baseUrl: string) => {
    const productsData = data.products.nodes
      .filter((product) => product.onlineStoreUrl)
      .map((product) => {
        const url = `${baseUrl}/products/${xmlEncode(product.handle)}`;

        const finalObject: ProductEntry = {
          url,
          lastMod: product.updatedAt,
          changeFreq: "daily",
        };

        if (product.featuredImage?.url) {
          finalObject.image = { url: xmlEncode(product.featuredImage.url) };

          if (product.title) finalObject.image.title = xmlEncode(product.title);

          if (product.featuredImage.altText)
            finalObject.image.caption = xmlEncode(
              product.featuredImage.altText,
            );
        }

        return finalObject;
      });

    const collectionsData = data.collections.nodes
      .filter((collection) => collection.onlineStoreUrl)
      .map((collection) => {
        const url = `${baseUrl}/collections/${xmlEncode(collection.handle)}`;
        return {
          url,
          lastMod: collection.updatedAt,
          changeFreq: "daily",
        };
      });

    const pagesData = data.pages.nodes
      .filter((page) => page.onlineStoreUrl)
      .map((page) => {
        const url = `${baseUrl}/pages/${xmlEncode(page.handle)}`;
        return {
          url,
          lastMod: page.updatedAt,
          changeFreq: "daily",
        };
      });

    const urlsDatas = [...productsData, ...collectionsData, ...pagesData];

    return `
      <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      >
        ${urlsDatas.map((data) => renderUrlTag(data)).join("")}
      </urlset>
    `;
  };

  const headers = {
    "Content-Type": "application/xml",
    // Cache for 24 hours
    "Cache-Control": `max-age=${60 * 60 * 24}`,
  };
  const body = shopSitemap(data, new URL(request.url).origin);

  return new Response(body, { headers });
}) satisfies RequestHandler;
