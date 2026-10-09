import { createContext, useContext } from "react";

export type DatasetBlockLocale = "en" | "cy";

const en = {
  datasetFacts: "Dataset facts",
  currentFiles: "Current files",
  archivedFiles: "Archived files",
  dataDictionary: "Data dictionary",
  rightsUsage: "Rights and usage",
  versionHistory: "Version history",
  datasetId: "Dataset ID",
  version: "Version",
  title: "Title",
  license: "License",
  fileCount: "File count",
  totalSize: "Total size",
  formats: "Formats",
  ingested: "Ingested",
  file: "File",
  format: "Format",
  size: "Size",
  uploaded: "Uploaded",
  columnName: "Column name",
  dataType: "Data type",
  queryableTable: "Queryable table",
  reuseGuidance: "Reuse guidance",
  citation: "Citation",
  contact: "Contact",
  sensitivityNotice: "Sensitivity notice",
  current: "Current",
  unknown: "unknown",
  bytes: "bytes",
  download: "Download",
  filesOne: "{count} file",
  filesOther: "{count} files",
  columnsOne: "{count} column",
  columnsOther: "{count} columns",
  noFiles: "No files are available.",
  noArchivedFiles: "No archived files are available.",
  noSchema: "No extracted schema metadata is available.",
  noLicense: "No license metadata is available.",
  noVersionHistory: "No version history is available.",
} as const;

export type DatasetBlockMessageId = keyof typeof en;

const cy: Record<DatasetBlockMessageId, string> = {
  datasetFacts: "Ffeithiau'r set ddata",
  currentFiles: "Ffeiliau cyfredol",
  archivedFiles: "Ffeiliau wedi'u harchifo",
  dataDictionary: "Geiriadur data",
  rightsUsage: "Hawliau a defnydd",
  versionHistory: "Hanes fersiynau",
  datasetId: "ID set ddata",
  version: "Fersiwn",
  title: "Teitl",
  license: "Trwydded",
  fileCount: "Nifer y ffeiliau",
  totalSize: "Cyfanswm y maint",
  formats: "Fformatau",
  ingested: "Mewnforiwyd",
  file: "Ffeil",
  format: "Fformat",
  size: "Maint",
  uploaded: "Uwchlwythwyd",
  columnName: "Enw'r golofn",
  dataType: "Math o ddata",
  queryableTable: "Tabl y gellir ei ymholi",
  reuseGuidance: "Canllawiau ailddefnyddio",
  citation: "Dyfyniad",
  contact: "Cyswllt",
  sensitivityNotice: "Hysbysiad sensitifrwydd",
  current: "Cyfredol",
  unknown: "anhysbys",
  bytes: "beit",
  download: "Lawrlwytho",
  filesOne: "{count} ffeil",
  filesOther: "{count} ffeil",
  columnsOne: "{count} colofn",
  columnsOther: "{count} colofn",
  noFiles: "Nid oes ffeiliau ar gael.",
  noArchivedFiles: "Nid oes ffeiliau wedi'u harchifo ar gael.",
  noSchema: "Nid oes metadata sgema wedi'i echdynnu ar gael.",
  noLicense: "Nid oes metadata trwydded ar gael.",
  noVersionHistory: "Nid oes hanes fersiynau ar gael.",
};

export const datasetBlockMessages = { en, cy } as const;

/** Optional ambient language; every block also accepts an explicit `language` prop. */
export const DatasetBlockLanguage = createContext<DatasetBlockLocale>("en");

export function useDatasetBlockLanguage(language?: DatasetBlockLocale) {
  const inherited = useContext(DatasetBlockLanguage);
  return language ?? inherited;
}

export type DatasetBlockText = ((id: DatasetBlockMessageId) => string) & {
  count: (kind: "files" | "columns", count: number) => string;
};

export function createDatasetBlockText(
  language: DatasetBlockLocale,
): DatasetBlockText {
  const table = datasetBlockMessages[language];
  const text = ((id: DatasetBlockMessageId) => table[id]) as DatasetBlockText;
  text.count = (kind, count) => {
    const id = `${kind}${count === 1 ? "One" : "Other"}` as const;
    return table[id].replace("{count}", count.toLocaleString("en-GB"));
  };
  return text;
}

export function useDatasetBlockText(language?: DatasetBlockLocale) {
  return createDatasetBlockText(useDatasetBlockLanguage(language));
}
