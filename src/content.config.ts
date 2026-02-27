import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string().min(1).max(80),
    description: z.string().min(1),
    slug: z.string().optional(),
  }),
});

const exhibitions = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/exhibitions" }),
  schema: z.any(),
});

const dataCards = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/data-cards" }),
  schema: z.object({
    title: z.string().min(1).max(80),
    summary: z.string().min(1),
    tags: z.array(z.string()).optional(),
    institutions: z.array(z.string()).optional(),
    rights: z.string().optional(),
    team: z.string().optional(),
    updated: z.string().optional(),
  }),
});

export const collections = { pages, exhibitions, dataCards };
