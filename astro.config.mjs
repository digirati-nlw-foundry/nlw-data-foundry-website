// @ts-check

import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import iiif from "iiif-hss/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    mdx({ gfm: true }),
    iiif({
      collections: [
        "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/PeaceCollection-HDD001_loc.json",
        "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/PeaceCollection-HDD002_loc.json",
      ],
    }),
  ],

  adapter: netlify(),

  vite: {
    plugins: [tailwindcss()],
  },
});
