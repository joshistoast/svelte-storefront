import { json } from '@sveltejs/kit'

export const GET = async (request: Request): Promise<Response> => {
  const sitemapUrl = undefined // TODO: this

  const robots = `
    User-agent: *
    Disallow: /admin
    Disallow: /cart
    Disallow: /orders
    Disallow: /checkouts/
    Disallow: /checkout
    Disallow: /carts
    Disallow: /account
    ${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}

    # Google adsbot ignores robots.txt unless specifically named
    User-agent: adsbot-google
    Disallow: /checkouts/
    Disallow: /checkout
    Disallow: /carts
    Disallow: /orders

    User-agent: Pinterest
    Crawl-delay: 1
  `.trim()

  return new Response(robots)
}
