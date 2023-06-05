# Svelte Storefront

This is my attempt to svelte-ify Shopify's Hydrogen storefront features. It's a work in progress, but I'm hoping to get it to a point where it's a good boilerplate/template for building a custom Shopify storefront with little hassle and built their favorite js framework (sveltekit).

## Getting Started

1. Clone the repo
2. Install Dependencies

   ```bash
    pnpm install
   ```

   > You can use your package manager of choice, but I strongly recommend `pnpm`

3. Create a `.env` file in the root of the project and add the following variables

   I've included a `.env.example` file to use as a template, the two variables that really only need to be changed are

   ```bash
   PUBLIC_STOREFRONT_API_TOKEN="your-public-token-here"
   PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
   ```

4. Run the project locally

   ```bash
   pnpm dev
   ```

5. Profit!

   Of course there's more to it than that, but this should get you started. I'll be adding more documentation as I go along (assuming I don't get burnt out).
