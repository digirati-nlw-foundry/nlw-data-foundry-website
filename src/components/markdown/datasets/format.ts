import type { DatasetBlockLocale } from "./i18n";

const UNITS = ["bytes", "KB", "MB", "GB", "TB"] as const;

/** Human readable size, e.g. `1.2 MB`. `exact` is the full byte count for tooltips. */
export function formatBytes(bytes: number | null, bytesLabel = "bytes") {
  if (typeof bytes !== "number") {
    return { exact: null, label: "—" };
  }

  const exact = `${bytes.toLocaleString("en-GB")} ${bytesLabel}`;
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < UNITS.length - 1) {
    value /= 1000;
    unit += 1;
  }
  if (unit === 0) {
    return { exact, label: exact };
  }
  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return {
    exact,
    label: `${Number(value.toFixed(digits)).toLocaleString("en-GB")} ${UNITS[unit]}`,
  };
}

/** Fixed-timezone formatting keeps server and client output identical. */
export function formatDate(
  value: string | null,
  language: DatasetBlockLocale = "en",
) {
  if (!value) {
    return { iso: null, label: "—" };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { iso: null, label: value };
  }

  return {
    iso: parsed.toISOString().slice(0, 10),
    label: new Intl.DateTimeFormat(language === "cy" ? "cy-GB" : "en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
      year: "numeric",
    }).format(parsed),
  };
}

const KNOWN_LABELS: Record<string, string> = {
  "application/x-zip-compressed": "ZIP",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.ms-excel": "XLS",
};

/** `text/csv` → `CSV`, `application/x-zip-compressed` → `ZIP`. */
export function formatLabel(contentType: string | null) {
  if (!contentType) {
    return null;
  }
  const type = contentType.split(";")[0] ?? contentType;
  const known = KNOWN_LABELS[type];
  if (known) {
    return known;
  }
  const subtype = type.split("/").pop() ?? type;
  return subtype.replace(/^(x-|vnd\.)/, "").toUpperCase();
}
