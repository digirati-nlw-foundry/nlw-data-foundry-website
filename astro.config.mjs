// @ts-check

import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import iiif from "iiif-hss/astro";

const pagefindDevServerUrl =
  process.env.PAGEFIND_DEV_SERVER_URL || "http://127.0.0.1:1414";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    mdx({ gfm: true }),
    iiif({
      serverUrl: process.env.IIIF_URL || undefined,
    }),
    icon(),
  ],

  adapter: netlify(),

  vite: {
    plugins: [tailwindcss()],
    server: {
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
