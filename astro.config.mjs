// @ts-check

import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import iiif from "iiif-hss/astro";
import { contentDirectory } from "./config/content.mjs";

const pagefindDevServerUrl =
  process.env.PAGEFIND_DEV_SERVER_URL || "http://127.0.0.1:1414";

// https://astro.build/config
export default defineConfig({
  server: {
    allowedHosts: ["website.localhost"],
  },
  integrations: [
    react(),
    mdx({ gfm: true }),
    iiif({
      configFile: process.env.IIIF_CONFIG_DIR || "./iiif-config",
      serverUrl: process.env.IIIF_URL || (process.env.DEPLOY_PRIME_URL ? `${process.env.DEPLOY_PRIME_URL}/iiif` : undefined),
    }),
    icon(),
  ],

  adapter: process.env.FOUNDRY_LOCAL_DEV === "1" ? undefined : netlify(),

  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: [process.cwd(), contentDirectory(".")],
      },
      proxy: {
        "/pagefind": {
          target: pagefindDevServerUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
});
