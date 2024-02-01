import type { RequestHandler } from "@sveltejs/kit";
import { countries } from "$lib/server/data";

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(countries), {
    headers: {
      "content-type": "application/json",
      "cache-control": "max-age=3600, public",
    },
  });
};
