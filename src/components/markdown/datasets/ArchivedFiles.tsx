import type { ReactNode } from "react";
import type {
  DatasetBlockArchivedVersion,
  DatasetBlockFile,
  DatasetBlockFrontmatter,
} from "./_helpers";
import { formatBytes, formatDate, getArchivedVersions } from "./_helpers";

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
      {message}
    </p>
  );
}

function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm mt-0 mb-0">
        {children}
      </table>
    </div>
  );
}

function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
      {children}
    </thead>
  );
}

function DataTableBody({ children }: { children: ReactNode }) {
  return (
    <tbody className="divide-y divide-slate-200 bg-white">{children}</tbody>
  );
}

function DataTableRow({ children }: { children: ReactNode }) {
  return <tr>{children}</tr>;
}

function DataTableHeaderCell({ children }: { children: ReactNode }) {
  return <th className="px-3 py-2 font-semibold">{children}</th>;
}

function DataTableCell({
  children,
  mono = false,
}: {
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <td
      className={`px-3 py-2 text-slate-700 ${mono ? "font-mono text-xs font-semibold text-slate-800" : ""}`}
    >
      {children}
    </td>
  );
}

function FileTable({ files }: { files: DatasetBlockFile[] }) {
  if (files.length === 0) {
    return <EmptyState message="No files are available." />;
  }

  return (
    <DataTable>
      <DataTableHead>
        <DataTableRow>
          <DataTableHeaderCell>File</DataTableHeaderCell>
          <DataTableHeaderCell>Format</DataTableHeaderCell>
          <DataTableHeaderCell>Size</DataTableHeaderCell>
          <DataTableHeaderCell>Uploaded</DataTableHeaderCell>
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        {files.map((file) => (
          <DataTableRow key={`${file.versionId}:${file.filename}`}>
            <DataTableCell mono>
              {file.apiLink ? (
                <a
                  className="text-blue-700 underline underline-offset-4"
                  href={file.apiLink}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {file.filename}
                </a>
              ) : (
                file.filename
              )}
            </DataTableCell>
            <DataTableCell>{file.contentType ?? "unknown"}</DataTableCell>
            <DataTableCell>{formatBytes(file.fileSizeBytes)}</DataTableCell>
            <DataTableCell>{formatDate(file.ingestedAt)}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}

function ArchivedVersionSection({
  version,
}: {
  version: DatasetBlockArchivedVersion;
}) {
  return (
    <section className="space-y-3" key={version.versionId}>
      <h3 className="text-base font-semibold text-slate-900">
        Version {version.versionId}
      </h3>
      <FileTable files={version.files} />
    </section>
  );
}

export function ArchivedFiles({
  frontmatter,
}: {
  frontmatter: DatasetBlockFrontmatter;
}) {
  const archivedVersions = getArchivedVersions(frontmatter);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Archived Files</h2>
        <p className="mt-1 text-sm text-slate-600">
          Files from previous or archived dataset versions.
        </p>
      </div>

      {archivedVersions.length === 0 ? (
        <EmptyState message="No archived files are available." />
      ) : (
        <div className="space-y-6">
          {archivedVersions.map((version) => (
            <ArchivedVersionSection key={version.versionId} version={version} />
          ))}
        </div>
      )}
    </section>
  );
}
