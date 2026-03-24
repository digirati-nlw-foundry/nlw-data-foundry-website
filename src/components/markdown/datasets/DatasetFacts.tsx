import type { DatasetBlockFrontmatter } from "./_helpers";
import { formatBytes, formatDate, getDatasetFacts } from "./_helpers";

export function DatasetFacts({
  frontmatter,
}: {
  frontmatter: DatasetBlockFrontmatter;
}) {
  const facts = getDatasetFacts(frontmatter);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Dataset Facts</h2>
        <p className="mt-1 text-sm text-slate-600">
          Snapshot of the managed dataset metadata for this card.
        </p>
      </div>

      <dl className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm md:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Dataset ID
          </dt>
          <dd className="mt-1 font-mono text-slate-900">
            {facts.datasetId ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Version
          </dt>
          <dd className="mt-1 text-slate-900">
            {facts.targetVersion !== null ? `v${facts.targetVersion}` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Title
          </dt>
          <dd className="mt-1 text-slate-900">{facts.title ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            License
          </dt>
          <dd className="mt-1 text-slate-900">{facts.license ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            File Count
          </dt>
          <dd className="mt-1 text-slate-900">{facts.totalFileCount}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total Size
          </dt>
          <dd className="mt-1 text-slate-900">
            {formatBytes(facts.totalSizeBytes)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Formats
          </dt>
          <dd className="mt-1 text-slate-900">
            {facts.fileFormats.join(", ") || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ingested
          </dt>
          <dd className="mt-1 text-slate-900">{formatDate(facts.ingestedAt)}</dd>
        </div>
      </dl>

      {facts.description ? (
        <p className="text-sm leading-6 text-slate-700">{facts.description}</p>
      ) : null}
    </section>
  );
}
