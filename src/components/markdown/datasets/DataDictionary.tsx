import type { ReactNode } from "react";
import type {
  DatasetBlockDataDictionary,
  DatasetBlockFrontmatter,
} from "./_helpers";
import { getDataDictionaries } from "./_helpers";

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

function DataDictionaryTables({
  entries,
}: {
  entries: DatasetBlockDataDictionary[];
}) {
  if (entries.length === 0) {
    return <EmptyState message="No extracted schema metadata is available." />;
  }

  return (
    <div className="space-y-5">
      {entries.map((entry) => (
        <section key={entry.filename}>
          <div className="mb-3">
            <h3 className="text-base font-semibold text-slate-900">
              {entry.filename}
            </h3>
            {entry.tableIdentifier ? (
              <p className="mt-1 text-sm text-slate-600">
                Queryable Catalog Table:{" "}
                <span className="font-mono text-xs text-slate-800">
                  {entry.tableIdentifier}
                </span>
              </p>
            ) : null}
          </div>

          <DataTable>
            <DataTableHead>
              <DataTableRow>
                <DataTableHeaderCell>Column Name</DataTableHeaderCell>
                <DataTableHeaderCell>Data Type</DataTableHeaderCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {Object.entries(entry.schema).map(([column, type]) => (
                <DataTableRow key={`${entry.filename}:${column}`}>
                  <DataTableCell mono>{column}</DataTableCell>
                  <DataTableCell>{type}</DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        </section>
      ))}
    </div>
  );
}

export function DataDictionary({
  frontmatter,
}: {
  frontmatter: DatasetBlockFrontmatter;
}) {
  const entries = getDataDictionaries(frontmatter);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Data Dictionary
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Extracted schema information for queryable tabular files.
        </p>
      </div>

      <DataDictionaryTables entries={entries} />
    </section>
  );
}
