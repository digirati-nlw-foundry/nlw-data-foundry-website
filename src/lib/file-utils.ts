export function formatBytes(value?: number): string | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return undefined;
  }
  if (value < 1024) return `${value} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let size = value / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  const precision = size >= 100 ? 0 : size >= 10 ? 1 : 2;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  "application/json": "JSON",
  "application/ld+json": "JSON-LD",
  "text/csv": "CSV",
  "text/plain": "TXT",
  "application/zip": "ZIP",
  "application/gzip": "GZIP",
  "application/xml": "XML",
  "text/xml": "XML",
  "application/pdf": "PDF",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
};

export function contentTypeLabel(ct?: string): string {
  if (!ct) return "";
  return CONTENT_TYPE_LABELS[ct] ?? ct.split("/")[1]?.toUpperCase() ?? ct;
}
