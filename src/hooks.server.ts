import type { Handle, RequestEvent } from "@sveltejs/kit";
import { shopify as storefront, countries } from "$lib/server/data";
import { redirect } from "@sveltejs/kit";
import type { Locale, UrlRedirectConnection } from "$lib/types";
import { handleSession } from "svelte-kit-cookie-session";
import { env } from "$env/dynamic/private";
import { REDIRECT_QUERY } from "$lib/server/data";
import { isLocalPath } from "$lib/utils";

const getLocale = (
  event: RequestEvent<Partial<Record<string, string>>>,
): Locale => {
  const { locale } = event.params;
  const defaultParam = "en-us";

  const acceptLanguage = event.request.headers.get("Accept-Language");
  const preferredLanguage = acceptLanguage?.split(",")[0]?.toLowerCase();
  const localeParam = locale || preferredLanguage || defaultParam;
  const selectedLocale = countries[localeParam] || countries[defaultParam];

  if (locale === defaultParam || !countries[localeParam]) {
    const originalUrl = event.request.url;
    const withoutLocaleUrl = originalUrl.replace(`/${localeParam}`, "");
    throw redirect(302, withoutLocaleUrl);
  }

  return selectedLocale;
};

export const handle: Handle = handleSession(
  {
    secret: env.SESSION_SECRET,
  },
  async ({ event, resolve }) => {
    const locale = getLocale(event);

    event.locals.storefront = storefront;
    event.locals.locale = locale;

    const response = await resolve(event, {
      transformPageChunk: ({ html }) => html.replace("%lang%", locale.language),
    });

    // Check shopify redirects for a match and redirect if found
    // else return the error page
    if (response.status === 404) {
      const { pathname, search, searchParams } = event.url;
      const redirectFrom = pathname + search;
      const redirectQuery = `path:${redirectFrom}`;

      try {
        const { data } = await storefront.query<{
          urlRedirects: UrlRedirectConnection;
        }>({
          query: REDIRECT_QUERY,
          variables: { query: redirectQuery },
        });

        const { urlRedirects } = data;
        const location = urlRedirects?.edges?.[0]?.node?.target;
        if (location)
          return new Response(null, { status: 301, headers: { location } });

        // Check for return_to or redirect query params
        const redirectTo =
          searchParams.get("return_to") || searchParams.get("redirect");
        if (redirectTo) {
          if (isLocalPath(redirectTo)) throw redirect(301, redirectTo);
          else
            console.warn(
              `Cross-domain redirects are not supported. Tried to redirect from ${redirectFrom} to ${redirectTo}`,
            );
        }
      } catch (error) {
        console.error(
          `Failed to fetch redirects from Storefront API for route ${redirectFrom}`,
          error,
        );
      }
    }

    return response;
  },
);
