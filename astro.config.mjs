// @ts-check

import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import iiif from "iiif-hss/astro";

import icon from "astro-icon";

const pagefindDevServerUrl =
  process.env.PAGEFIND_DEV_SERVER_URL || "http://127.0.0.1:1414";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx({ gfm: true }), iiif({
    serverUrl: process.env.IIIF_URL || undefined,
    manifests: [
      "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085440-manifest.json",
      "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085445-manifest.json",
      "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085450-manifest.json",
      "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085455-manifest.json",
      "https://datasyllwr.llgc.org.uk/manifests/PeacePetition/loc/manifests/6085460-manifest.json",
    ],
  }), icon()],

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
