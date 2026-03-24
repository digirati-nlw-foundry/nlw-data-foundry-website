import type { ReactNode } from "react";
import type {
  DatasetBlockFrontmatter,
  DatasetBlockVersionSummary,
} from "./_helpers";
import { formatBytes, formatDate, getVersionHistory } from "./_helpers";

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

function DataTableCell({ children }: { children: ReactNode }) {
  return <td className="px-3 py-2 text-slate-700">{children}</td>;
}

function VersionHistoryTable({
  versions,
}: {
  versions: DatasetBlockVersionSummary[];
}) {
  if (versions.length === 0) {
    return <EmptyState message="No version history is available." />;
  }

  return (
    <DataTable>
      <DataTableHead>
        <DataTableRow>
          <DataTableHeaderCell>Version</DataTableHeaderCell>
          <DataTableHeaderCell>Files</DataTableHeaderCell>
          <DataTableHeaderCell>Formats</DataTableHeaderCell>
          <DataTableHeaderCell>Size</DataTableHeaderCell>
          <DataTableHeaderCell>Release Date</DataTableHeaderCell>
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        {versions.map((version) => (
          <DataTableRow key={version.versionId}>
            <DataTableCell>v{version.versionId}</DataTableCell>
            <DataTableCell>{version.fileCount}</DataTableCell>
            <DataTableCell>{version.fileFormats.join(", ")}</DataTableCell>
            <DataTableCell>{formatBytes(version.totalSizeBytes)}</DataTableCell>
            <DataTableCell>{formatDate(version.releaseDate)}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}

export function VersionHistory({
  frontmatter,
}: {
  frontmatter: DatasetBlockFrontmatter;
}) {
  const versions = getVersionHistory(frontmatter);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Version History
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Derived summary of current and archived dataset versions.
        </p>
      </div>

      <VersionHistoryTable versions={versions} />
    </section>
  );
}
