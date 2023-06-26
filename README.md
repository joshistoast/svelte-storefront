# 🛍️ Svelte Storefront

🚧 This project aims to bring the magic of Shopify's Hydrogen storefront features to the Svelte world. This project is still on the assembly line, but I'm aiming to shape it into a go-to boilerplate/template that can ease the process of building a personalized Shopify storefront using everyone's beloved JavaScript framework - Sveltekit.

**💧 What is Hydrogen?**<br />
Hydrogen is Shopify’s stack for headless commerce. It provides a set of tools, utilities, and best-in-class examples for building dynamic and performant commerce applications. Hydrogen is designed to dovetail with Remix, Shopify’s full stack web framework, but it also provides a React library portable to other supporting frameworks.

## ⚡ Key Features

All the features you'd expect from a modern headless eCommerce storefront, and more:

- 🌐 **SSR**: Server-Side Rendering for superior SEO and initial load performance.
- 🎨 **Style-Free**: No predefined styles to hold you back. Freedom to create your unique storefront design.
- 💨 **Tailwind**: Lean and fast CSS framework tailored for modern frontend development.
- 🚀 **Fast**: Engineered for high-speed performance and optimal user experience.
- ⚙️ **Optimized**: Crafted with best practices for efficient resource utilization.
- 🧹 **Clean Code**: Well-structured, readable, and maintainable codebase.

## 🎈Shopify Features

Almost every aspect and feature of a Shopify theme is covered in this project. Here's a list of the features that are currently implemented:

- 🌐 URL-based Localization & Currency Conversion
- 🏬 Collection Pages
- 📦 Product Pages
- 🔍 Product Search
- 🔒 Authentication & Account Pages
- 📧 Customer account activation via email
- 🛒 Fully functional cart
- 📖 Blog Pages
- 🎟️ Discount URL handling
- 📃 Policy Pages
- 📑 Standard Shopify Pages

## 📝 To Do

- [ ] 📈 Sync Analytics with Shopify Admin
- [ ] 🖼️ Optimized and performant images
- [ ] ↕️ Filtering & Sorting collections
- [ ] 🔗 Convert shopify links to local links where applicable

## 💡 Prerequisites

Before getting started, make sure you have the following:

- Node.js installed (preferably the latest version)
- A Shopify account and a store to work with
- Basic understanding of Svelte and JavaScript/TypeScript

## 🚀 Getting Started

1. 📂 Clone the repo
2. 💻 Install Dependencies

   ```bash
    pnpm install
   ```

   > You can use your package manager of choice, but I strongly recommend `pnpm`

3. 🔑 Create a .env file in the root of the project and fill in the required variables

   An example .env.example file is provided to guide you, the two essentials that need replacing are:

   ```bash
   PUBLIC_STOREFRONT_API_TOKEN="your-public-token-here"
   PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
   # Optional
   PUBLIC_STOREFRONT_API_VERSION="2023-04"
   ```

   > To get the `PUBLIC_STOREFRONT_API_TOKEN` and `PUBLIC_STORE_DOMAIN`, refer to the Shopify API Documentation [here](https://shopify.dev/docs/api/storefront#authentication).

4. 🚦 Run the project locally

   ```bash
   pnpm dev
   ```

5. 🎉 Start building your storefront!

   There's more under the hood, and detailed documentation is coming soon.
