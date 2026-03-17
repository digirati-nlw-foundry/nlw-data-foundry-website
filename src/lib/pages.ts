import { type CollectionEntry, getCollection } from "astro:content";
import type { Locale, LocalizedString } from "./i18n";

type PageEntry = CollectionEntry<"pages">;
type PageGroup = Partial<Record<Locale, PageEntry>>;
type CanonicalField = "slug" | "section";
type LocalizedField = "title" | "description" | "intro";

const pageFilePattern = /^src\/content\/pages\/(.+)\.(en|cy)\.(md|mdx)$/;

export interface SitePage {
  id: string;
  slug: string;
  section: string;
  title: LocalizedString;
  description: LocalizedString;
  intro: LocalizedString;
  entries: {
    en: PageEntry;
    cy?: PageEntry;
  };
}

function getEntryLocale(entry: PageEntry): Locale {
  const match = entry.filePath?.match(pageFilePattern);

  if (!match) {
    throw new Error(
      `Page entry "${entry.id}" must use the src/content/pages/**/name.en.md or name.cy.md convention.`,
    );
  }

  return match[2] as Locale;
}

function getEntryKey(entry: PageEntry) {
  const match = entry.filePath?.match(pageFilePattern);

  if (!match) {
    throw new Error(
      `Page entry "${entry.id}" must use the src/content/pages/**/name.en.md or name.cy.md convention.`,
    );
  }

  return match[1];
}

function requireEnglishField(
  entry: PageEntry,
  field: CanonicalField | LocalizedField,
) {
  const value = entry.data[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `English page "${entry.id}" is missing required "${field}" front matter.`,
    );
  }

  return value;
}

function validateCanonicalOverride(
  entry: PageEntry | undefined,
  field: CanonicalField,
  expected: string,
) {
  const value = entry?.data[field];

  if (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value !== expected
  ) {
    throw new Error(
      `Translated page "${entry.id}" cannot override canonical "${field}" (${expected}).`,
    );
  }
}

function getLocalizedField(
  enEntry: PageEntry,
  cyEntry: PageEntry | undefined,
  field: LocalizedField,
): LocalizedString {
  const en = requireEnglishField(enEntry, field);
  const cyValue = cyEntry?.data[field];

  return {
    en,
    cy: typeof cyValue === "string" && cyValue.trim().length > 0 ? cyValue : en,
  };
}

function mergePageGroup(id: string, group: PageGroup): SitePage {
  const enEntry = group.en;

  if (!enEntry) {
    throw new Error(
      `Page group "${id}" is missing an English source file. Add a matching *.en.md file.`,
    );
  }

  const cyEntry = group.cy;
  const slug = requireEnglishField(enEntry, "slug");
  const section = requireEnglishField(enEntry, "section");

  validateCanonicalOverride(cyEntry, "slug", slug);
  validateCanonicalOverride(cyEntry, "section", section);

  return {
    id,
    slug,
    section,
    title: getLocalizedField(enEntry, cyEntry, "title"),
    description: getLocalizedField(enEntry, cyEntry, "description"),
    intro: getLocalizedField(enEntry, cyEntry, "intro"),
    entries: {
      en: enEntry,
      ...(cyEntry ? { cy: cyEntry } : {}),
    },
  };
}

export async function getPages() {
  const entries = await getCollection("pages");
  const groups = new Map<string, PageGroup>();

  for (const entry of entries) {
    const key = getEntryKey(entry);
    const locale = getEntryLocale(entry);
    const group = groups.get(key) ?? {};

    if (group[locale]) {
      throw new Error(`Duplicate ${locale} page found for "${key}".`);
    }

    group[locale] = entry;
    groups.set(key, group);
  }

  const pages = Array.from(groups, ([id, group]) => mergePageGroup(id, group));
  const seenSlugs = new Set<string>();

  for (const page of pages) {
    if (seenSlugs.has(page.slug)) {
      throw new Error(
        `Duplicate page slug "${page.slug}" found in content pages.`,
      );
    }

    seenSlugs.add(page.slug);
  }

  return pages.sort((left, right) => left.slug.localeCompare(right.slug));
}
