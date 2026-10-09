import type { DatasetBlockFile } from "../data";
import { formatBytes, formatDate, formatLabel } from "../format";
import type { DatasetBlockLocale } from "../i18n";
import { useDatasetBlockText } from "../i18n";
import { Empty } from "./Section";
import { Table } from "./Table";

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 3v12m0 0-4-4m4 4 4-4M4 20h16" />
    </svg>
  );
}

export function FileTable({
  files,
  language,
}: {
  files: DatasetBlockFile[];
  language: DatasetBlockLocale;
}) {
  const text = useDatasetBlockText(language);
  if (files.length === 0) {
    return <Empty message={text("noFiles")} />;
  }

  return (
    <Table
      columns={[
        { label: text("file") },
        { label: text("format") },
        { label: text("size"), numeric: true },
        { label: text("uploaded"), numeric: true },
      ]}
      label={text("file")}
    >
      {files.map((file) => {
        const size = formatBytes(file.fileSizeBytes, text("bytes"));
        const uploaded = formatDate(file.ingestedAt, language);
        const format = formatLabel(file.contentType);
        return (
          <tr key={`${file.versionId}:${file.filename}`}>
            <td>
              {file.apiLink ? (
                <a
                  className="dsb-file dsb-mono"
                  download
                  href={file.apiLink}
                  rel="noreferrer noopener"
                  title={text("download")}
                >
                  {file.filename}
                  <DownloadIcon />
                </a>
              ) : (
                <span className="dsb-file dsb-mono">{file.filename}</span>
              )}
            </td>
            <td>
              <span className="dsb-badge">{format ?? text("unknown")}</span>
            </td>
            <td className="dsb-num" title={size.exact ?? undefined}>
              {size.label}
            </td>
            <td className="dsb-num">
              {uploaded.iso ? (
                <time dateTime={uploaded.iso}>{uploaded.label}</time>
              ) : (
                uploaded.label
              )}
            </td>
          </tr>
        );
      })}
    </Table>
  );
}
