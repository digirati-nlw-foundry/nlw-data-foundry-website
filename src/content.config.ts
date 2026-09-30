import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const localizedString = z.object({
  en: z.string().min(1),
  cy: z.string().min(1),
});

const localizedLink = z.object({
  href: z.string().min(1),
  label: localizedString,
  description: localizedString.optional(),
});

const dataTable = z.object({
  caption: localizedString,
  columns: z.array(localizedString).min(1),
  rows: z.array(z.array(z.string())).min(1),
});

const downloads = z.object({
  name: localizedString,
  format: z.string().min(1),
  size: z.string().min(1),
  version: z.string().min(1),
  href: z.string().min(1),
});

const versionEntry = z.object({
  version: z.string().min(1),
  date: z.string().min(1),
  note: localizedString,
  links: z.array(localizedLink).optional(),
});

const datasetFile = z.object({
  file_name: z.string().min(1),
  file_url: z.string().min(1),
  file_size_bytes: z.number().int().nonnegative().optional(),
  content_type: z.string().min(1).optional(),
  sha256: z.string().min(1).optional(),
  ingested_at: z.string().min(1).optional(),
  api_link: z.string().min(1).optional(),
});

const datasetFileVersions = z.record(z.string(), z.array(datasetFile));

const datasetFiles = z.object({
  active: datasetFileVersions.optional(),
  archived: datasetFileVersions.optional(),
});

const dataCards = defineCollection({
  loader: glob({
    pattern: "**/*.{en,cy}.{md,mdx}",
    base: "./src/content/data-cards",
  }),
  schema: z.object({
    dataset_id: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    license: z.string().optional(),
    ingested_at: z.string().min(1).optional(),
    action: z.string().min(1).optional(),
    target_version: z.number().int().positive().optional(),
    total_size_bytes: z.number().int().nonnegative().optional(),
    total_file_count: z.number().int().nonnegative().optional(),
    file_formats: z.array(z.string()).optional(),
    files: datasetFiles.optional(),
    featured: z.boolean().optional(),
    featuredOrder: z.number().optional(),
    accent: z.string().optional(),
    tags: z.array(z.string()).optional(),
    institutions: z.array(z.string()).optional(),
    rights: z.string().optional(),
    team: z.string().optional(),
    updated: z.string().optional(),
  }),
});

const exhibitions = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/exhibitions" }),
  schema: z.object({
    title: localizedString,
    summary: localizedString,
    theme: localizedString,
    featured: z.boolean().optional(),
    featuredOrder: z.number().optional(),
    accent: z.string().optional(),
    manifestUrl: z.string().optional(),
    tags: z.array(localizedString).optional(),
    relatedDatasets: z.array(z.string()).optional(),
    externalLinks: z.array(localizedLink).optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.{en,cy}.{md,mdx}",
    base: "./src/content/pages",
  }),
  schema: z.object({
    slug: z.string().min(1).optional(),
    section: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    intro: z.string().min(1).optional(),
  }),
});

export const collections = { exhibitions, dataCards, pages };
