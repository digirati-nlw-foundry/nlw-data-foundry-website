export type DatasetBlockFrontmatter = Record<string, unknown>;

export type DatasetBlockFile = {
  apiLink: string | null;
  contentType: string | null;
  extractedSchema: Record<string, string> | null;
  fileSizeBytes: number | null;
  filename: string;
  hasExtractedData: boolean;
  ingestedAt: string | null;
  tableIdentifier: string | null;
  versionId: number;
};

export type DatasetBlockArchivedVersion = {
  files: DatasetBlockFile[];
  versionId: number;
};

export type DatasetBlockVersionSummary = {
  fileCount: number;
  fileFormats: string[];
  releaseDate: string | null;
  totalSizeBytes: number;
  versionId: number;
};

export type DatasetBlockDataDictionary = {
  filename: string;
  schema: Record<string, string>;
  tableIdentifier: string | null;
};

export type DatasetBlockFacts = {
  action: string | null;
  datasetId: string | null;
  description: string | null;
  fileFormats: string[];
  ingestedAt: string | null;
  license: string | null;
  targetVersion: number | null;
  title: string | null;
  totalFileCount: number;
  totalSizeBytes: number | null;
};

export type DatasetBlockRights = {
  citation: string | null;
  contact: string | null;
  license: string | null;
  reuseGuidance: string | null;
  sensitivityNotice: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function asString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toSchemaRecord(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  const entries = Object.entries(value)
    .map(([key, item]) => [key, String(item)] as const)
    .filter(([, item]) => item.length > 0);

  return entries.length > 0 ? Object.fromEntries(entries) : null;
}

function toPositiveInteger(value: unknown) {
  const parsed = asNumber(value);
  return parsed !== null && Number.isInteger(parsed) && parsed > 0
    ? parsed
    : null;
}

function sortVersionsDescending<T extends { versionId: number }>(values: T[]) {
  return [...values].sort((left, right) => right.versionId - left.versionId);
}

function toDatasetBlockFile(
  value: unknown,
  fallbackVersionId: number,
): DatasetBlockFile | null {
  if (!isRecord(value)) {
    return null;
  }

  const filename =
    asString(value.file_name) ??
    asString(value.filename) ??
    asString(value.name) ??
    null;

  if (!filename) {
    return null;
  }

  return {
    apiLink:
      asString(value.api_link) ??
      asString(value.download_url) ??
      asString(value.file_url),
    contentType: asString(value.content_type),
    extractedSchema: toSchemaRecord(value.extracted_schema),
    fileSizeBytes: asNumber(value.file_size_bytes),
    filename,
    hasExtractedData: asBoolean(value.has_extracted_data) ?? false,
    ingestedAt: asString(value.ingested_at),
    tableIdentifier: asString(value.data_table_identifier),
    versionId: toPositiveInteger(value.version_id) ?? fallbackVersionId,
  };
}

function buildVersionGroups(
  frontmatter: DatasetBlockFrontmatter,
  key: "active" | "archived",
) {
  const filesValue = frontmatter.files;
  if (!isRecord(filesValue) || !isRecord(filesValue[key])) {
    return [] satisfies DatasetBlockArchivedVersion[];
  }

  return sortVersionsDescending(
    Object.entries(filesValue[key])
      .map(([version, group]) => {
        const parsedVersion = Number(version);
        return {
          files: Array.isArray(group)
            ? group
                .map((item) => toDatasetBlockFile(item, parsedVersion))
                .filter((item): item is DatasetBlockFile => item !== null)
            : [],
          versionId: parsedVersion,
        };
      })
      .filter(
        (group) => Number.isInteger(group.versionId) && group.files.length > 0,
      ),
  );
}

function getTargetVersion(frontmatter: DatasetBlockFrontmatter) {
  return toPositiveInteger(frontmatter.target_version);
}

function resolveCurrentFiles(frontmatter: DatasetBlockFrontmatter) {
  const activeVersions = buildVersionGroups(frontmatter, "active");
  const targetVersion = getTargetVersion(frontmatter);

  if (targetVersion !== null) {
    const exactMatch = activeVersions.find(
      (version) => version.versionId === targetVersion,
    );

    if (exactMatch) {
      return {
        files: exactMatch.files,
        versionId: exactMatch.versionId,
      };
    }
  }

  const fallbackVersion = activeVersions[0];
  if (!fallbackVersion) {
    return {
      files: [] as DatasetBlockFile[],
      versionId: targetVersion,
    };
  }

  return {
    files: fallbackVersion.files,
    versionId: fallbackVersion.versionId,
  };
}

function getAllActiveFiles(frontmatter: DatasetBlockFrontmatter) {
  return buildVersionGroups(frontmatter, "active").flatMap(
    (group) => group.files,
  );
}

export function formatBytes(bytes: number | null) {
  return typeof bytes === "number"
    ? `${bytes.toLocaleString("en-GB")} bytes`
    : "—";
}

export function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toISOString().slice(0, 10);
}

export function getDatasetFacts(
  frontmatter: DatasetBlockFrontmatter,
): DatasetBlockFacts {
  const activeFiles = getAllActiveFiles(frontmatter);
  const frontmatterFormats = asStringArray(frontmatter.file_formats);

  return {
    action: asString(frontmatter.action),
    datasetId: asString(frontmatter.dataset_id),
    description: asString(frontmatter.description),
    fileFormats:
      frontmatterFormats.length > 0
        ? frontmatterFormats
        : Array.from(
            new Set(
              activeFiles
                .map((file) => file.contentType)
                .filter((item): item is string => item !== null),
            ),
          ),
    ingestedAt: asString(frontmatter.ingested_at),
    license: asString(frontmatter.license),
    targetVersion: getTargetVersion(frontmatter),
    title: asString(frontmatter.title),
    totalFileCount: asNumber(frontmatter.total_file_count) ?? activeFiles.length,
    totalSizeBytes:
      asNumber(frontmatter.total_size_bytes) ??
      activeFiles.reduce((total, file) => total + (file.fileSizeBytes ?? 0), 0),
  };
}

export function getCurrentFiles(frontmatter: DatasetBlockFrontmatter) {
  return resolveCurrentFiles(frontmatter).files;
}

export function getArchivedVersions(frontmatter: DatasetBlockFrontmatter) {
  return buildVersionGroups(frontmatter, "archived");
}

export function getVersionHistory(
  frontmatter: DatasetBlockFrontmatter,
): DatasetBlockVersionSummary[] {
  const current = resolveCurrentFiles(frontmatter);
  const archivedVersions = getArchivedVersions(frontmatter);
  const groupedVersions = new Map<number, DatasetBlockFile[]>();

  if (current.versionId !== null && current.files.length > 0) {
    groupedVersions.set(current.versionId, current.files);
  }

  for (const version of archivedVersions) {
    groupedVersions.set(version.versionId, [
      ...(groupedVersions.get(version.versionId) ?? []),
      ...version.files,
    ]);
  }

  return sortVersionsDescending(
    Array.from(groupedVersions.entries()).map(([versionId, files]) => {
      const fileFormats = Array.from(
        new Set(files.map((file) => file.contentType ?? "unknown")),
      );
      const totalSizeBytes = files.reduce(
        (total, file) => total + (file.fileSizeBytes ?? 0),
        0,
      );
      const releaseDate = files.reduce<string | null>((latest, file) => {
        if (!file.ingestedAt) {
          return latest;
        }

        if (!latest) {
          return file.ingestedAt;
        }

        const currentTime = new Date(file.ingestedAt).getTime();
        const latestTime = new Date(latest).getTime();
        if (Number.isNaN(currentTime) || Number.isNaN(latestTime)) {
          return latest;
        }

        return currentTime > latestTime ? file.ingestedAt : latest;
      }, null);

      return {
        fileCount: files.length,
        fileFormats,
        releaseDate,
        totalSizeBytes,
        versionId,
      } satisfies DatasetBlockVersionSummary;
    }),
  );
}

export function getDataDictionaries(
  frontmatter: DatasetBlockFrontmatter,
): DatasetBlockDataDictionary[] {
  return getCurrentFiles(frontmatter)
    .filter((file) => file.hasExtractedData && file.extractedSchema)
    .map((file) => ({
      filename: file.filename,
      schema: file.extractedSchema ?? {},
      tableIdentifier: file.tableIdentifier,
    }))
    .filter((entry) => Object.keys(entry.schema).length > 0);
}

export function getDatasetRights(
  frontmatter: DatasetBlockFrontmatter,
): DatasetBlockRights {
  const contact =
    asString(frontmatter.contact) ?? asString(frontmatter.contact_enquiries);

  return {
    citation: asString(frontmatter.citation),
    contact,
    license: asString(frontmatter.license),
    reuseGuidance: asString(frontmatter.reuse_guidance),
    sensitivityNotice: asString(frontmatter.sensitivity_notice),
  };
}
