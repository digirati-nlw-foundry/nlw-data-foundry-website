export const datasetBlockNames = [
  "DatasetFacts",
  "CurrentFiles",
  "ArchivedFiles",
  "VersionHistory",
  "DataDictionary",
  "RightsUsage",
] as const;

export type DatasetBlockName = (typeof datasetBlockNames)[number];
