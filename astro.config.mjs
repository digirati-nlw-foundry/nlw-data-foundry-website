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
      manifests: [
        "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085440-manifest.json",
        "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085445-manifest.json",
        "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085450-manifest.json",
        "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085455-manifest.json",
        "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085460-manifest.json",
      ],
    }),
  ],

  adapter: netlify(),

  vite: {
    plugins: [tailwindcss()],
  },
});
