import { type CollectionEntry, getCollection } from "astro:content";
import type { Locale, LocalizedString } from "./i18n";

type DataCardEntry = CollectionEntry<"dataCards">;
type DataCardGroup = Partial<Record<Locale, DataCardEntry>>;
type CanonicalStringField =
  | "dataset_id"
  | "license"
  | "ingested_at"
  | "accent";
type LocalizedField = "title" | "description" | "rights" | "team" | "updated";
type LocalizedListField = "tags" | "institutions";
type DataCardFilesField = NonNullable<DataCardEntry["data"]["files"]>;
type DataCardFileVersions = NonNullable<DataCardFilesField["active"]>;
type DataCardFile = DataCardFileVersions[string][number];

const dataCardFilePattern =
  /^src\/content\/data-cards\/(.+)\.(en|cy)\.(md|mdx)$/;

export interface SiteDataCardFile {
  fileName: string;
  fileUrl: string;
  fileSizeBytes?: number;
  contentType?: string;
  sha256?: string;
  ingestedAt?: string;
  apiLink?: string;
}

export interface SiteDataCardFileGroup {
  version: string;
  files: SiteDataCardFile[];
}

export interface SiteDataCard {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString | undefined;
  datasetId: string;
  license?: string;
  ingestedAt?: string;
  files: {
    active: SiteDataCardFileGroup[];
    archived: SiteDataCardFileGroup[];
  };
  featured: boolean;
  featuredOrder?: number;
  accent?: string;
  tags: LocalizedString[];
  institutions: LocalizedString[];
  rights?: LocalizedString;
  team?: LocalizedString;
  updated?: LocalizedString;
  entries: {
    en: DataCardEntry;
    cy?: DataCardEntry;
  };
}

function getFileMatch(entry: DataCardEntry) {
  const match = entry.filePath?.match(dataCardFilePattern);

  if (!match) {
    throw new Error(
      `Data card "${entry.id}" must use the src/content/data-cards/**/name.en.md or name.cy.md convention.`,
    );
  }

  return match;
}

function getEntryLocale(entry: DataCardEntry): Locale {
  return getFileMatch(entry)[2] as Locale;
}

function getEntryKey(entry: DataCardEntry) {
  return getFileMatch(entry)[1];
}

function requireEnglishField(
  entry: DataCardEntry,
  field: LocalizedField,
) {
  const value = entry.data[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `English data card "${entry.id}" is missing required "${field}" front matter.`,
    );
  }

  return value;
}

function serializeForComparison(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => serializeForComparison(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(
        ([key, item]) => `${JSON.stringify(key)}:${serializeForComparison(item)}`,
      )
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function getLocalizedField(
  enEntry: DataCardEntry,
  cyEntry: DataCardEntry | undefined,
  field: LocalizedField,
): LocalizedString | undefined {
  const enValue = enEntry.data[field];
  const cyValue = cyEntry?.data[field];

  if (typeof enValue !== "string" || enValue.trim().length === 0) {
    return undefined;
  }

  return {
    en: enValue,
    cy:
      typeof cyValue === "string" && cyValue.trim().length > 0
        ? cyValue
        : enValue,
  };
}

function getLocalizedList(
  enEntry: DataCardEntry,
  cyEntry: DataCardEntry | undefined,
  field: LocalizedListField,
): LocalizedString[] {
  const enValues = enEntry.data[field] ?? [];
  const cyValues = cyEntry?.data[field] ?? [];

  if (cyValues.length > enValues.length) {
    throw new Error(
      `Translated data card "${cyEntry?.id}" has more "${field}" entries than its English source.`,
    );
  }

  return enValues.map((enValue, index) => ({
    en: enValue,
    cy: cyValues[index] ?? enValue,
  }));
}

function validateCanonicalStringOverride(
  entry: DataCardEntry | undefined,
  field: CanonicalStringField,
  expected: string | undefined,
) {
  const value = entry?.data[field];

  if (!expected || typeof value !== "string" || value.trim().length === 0) {
    return;
  }

  if (value !== expected) {
    throw new Error(
      `Translated data card "${entry?.id}" cannot override canonical "${field}" (${expected}).`,
    );
  }
}

function validateCanonicalObjectOverride(
  entry: DataCardEntry | undefined,
  field: "files",
  expected: DataCardEntry["data"]["files"] | undefined,
) {
  const value = entry?.data[field];

  if (!expected || typeof value === "undefined") {
    return;
  }

  if (serializeForComparison(value) !== serializeForComparison(expected)) {
    throw new Error(
      `Translated data card "${entry?.id}" cannot override canonical "${field}".`,
    );
  }
}

function validateCanonicalPrimitiveOverride(
  entry: DataCardEntry | undefined,
  field: "featured" | "featuredOrder",
  expected: boolean | number | undefined,
) {
  const value = entry?.data[field];

  if (typeof expected === "undefined" || typeof value === "undefined") {
    return;
  }

  if (value !== expected) {
    throw new Error(
      `Translated data card "${entry?.id}" cannot override canonical "${field}" (${expected}).`,
    );
  }
}

function normalizeFiles(
  files: DataCardEntry["data"]["files"] | undefined,
): SiteDataCard["files"] {
  const normalizeVersions = (
    versions: DataCardFileVersions | undefined,
  ): SiteDataCardFileGroup[] =>
    Object.entries(versions ?? {})
      .sort(([left], [right]) =>
        right.localeCompare(left, undefined, { numeric: true }),
      )
      .map(([version, fileEntries]) => ({
        version,
        files: fileEntries.map((file: DataCardFile) => ({
          fileName: file.file_name,
          fileUrl: file.file_url,
          fileSizeBytes: file.file_size_bytes,
          contentType: file.content_type,
          sha256: file.sha256,
          ingestedAt: file.ingested_at,
          apiLink: file.api_link,
        })),
      }));

  return {
    active: normalizeVersions(files?.active),
    archived: normalizeVersions(files?.archived),
  };
}

function mergeDataCardGroup(id: string, group: DataCardGroup): SiteDataCard {
  const enEntry = group.en;

  if (!enEntry) {
    throw new Error(
      `Data card group "${id}" is missing an English source file. Add a matching *.en.md file.`,
    );
  }

  const cyEntry = group.cy;
  const datasetId = enEntry.data.dataset_id;

  if (!datasetId) {
    throw new Error(
      `English data card "${enEntry.id}" is missing required "dataset_id" front matter.`,
    );
  }

  if (datasetId !== id) {
    throw new Error(
      `Data card "${enEntry.id}" has dataset_id "${datasetId}" but the file is named "${id}". The dataset_id, filename (without locale/extension), and slug must all match.`,
    );
  }

  const slug = datasetId;
  const title = getLocalizedField(enEntry, cyEntry, "title");
  const description = getLocalizedField(enEntry, cyEntry, "description");

  if (!title) {
    throw new Error(
      `English data card "${enEntry.id}" must include title.`,
    );
  }

  validateCanonicalStringOverride(cyEntry, "dataset_id", datasetId);
  validateCanonicalStringOverride(cyEntry, "license", enEntry.data.license);
  validateCanonicalStringOverride(
    cyEntry,
    "ingested_at",
    enEntry.data.ingested_at,
  );
  validateCanonicalStringOverride(cyEntry, "accent", enEntry.data.accent);
  validateCanonicalObjectOverride(cyEntry, "files", enEntry.data.files);
  validateCanonicalPrimitiveOverride(
    cyEntry,
    "featured",
    enEntry.data.featured,
  );
  validateCanonicalPrimitiveOverride(
    cyEntry,
    "featuredOrder",
    enEntry.data.featuredOrder,
  );

  return {
    id,
    slug,
    title,
    description,
    datasetId,
    license: enEntry.data.license,
    ingestedAt: enEntry.data.ingested_at,
    files: normalizeFiles(enEntry.data.files),
    featured: enEntry.data.featured ?? false,
    featuredOrder: enEntry.data.featuredOrder,
    accent: enEntry.data.accent,
    tags: getLocalizedList(enEntry, cyEntry, "tags"),
    institutions: getLocalizedList(enEntry, cyEntry, "institutions"),
    rights: getLocalizedField(enEntry, cyEntry, "rights"),
    team: getLocalizedField(enEntry, cyEntry, "team"),
    updated: getLocalizedField(enEntry, cyEntry, "updated"),
    entries: {
      en: enEntry,
      ...(cyEntry ? { cy: cyEntry } : {}),
    },
  };
}

export async function getDataCards() {
  const entries = await getCollection("dataCards");
  const groups = new Map<string, DataCardGroup>();

  for (const entry of entries) {
    const key = getEntryKey(entry);
    const locale = getEntryLocale(entry);
    const group = groups.get(key) ?? {};

    if (group[locale]) {
      throw new Error(`Duplicate ${locale} data card found for "${key}".`);
    }

    group[locale] = entry;
    groups.set(key, group);
  }

  const cards = Array.from(groups, ([id, group]) =>
    mergeDataCardGroup(id, group),
  );
  const seenSlugs = new Set<string>();

  for (const card of cards) {
    if (seenSlugs.has(card.slug)) {
      throw new Error(
        `Duplicate data-card slug "${card.slug}" found in content.`,
      );
    }

    seenSlugs.add(card.slug);
  }

  return cards.sort((left, right) => left.slug.localeCompare(right.slug));
}
