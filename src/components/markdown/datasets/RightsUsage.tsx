import type { DatasetBlockFrontmatter } from "./_helpers";
import { getDatasetRights } from "./_helpers";

export function RightsUsage({
  frontmatter,
}: {
  frontmatter: DatasetBlockFrontmatter;
}) {
  const rights = getDatasetRights(frontmatter);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Rights And Usage
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Rights metadata available for this dataset card.
        </p>
      </div>

      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            License
          </p>
          <p className="mt-1 text-slate-900">
            {rights.license ?? "No license metadata is available."}
          </p>
        </div>

        {rights.reuseGuidance ? (
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Reuse Guidance
            </h3>
            <p className="mt-1">{rights.reuseGuidance}</p>
          </div>
        ) : null}

        {rights.citation ? (
          <div>
            <h3 className="text-base font-semibold text-slate-900">Citation</h3>
            <p className="mt-1 rounded-md bg-slate-50 p-3 font-medium text-slate-800">
              {rights.citation}
            </p>
          </div>
        ) : null}

        {rights.contact ? (
          <div>
            <h3 className="text-base font-semibold text-slate-900">Contact</h3>
            <p className="mt-1">{rights.contact}</p>
          </div>
        ) : null}

        {rights.sensitivityNotice ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900">
            {rights.sensitivityNotice}
          </div>
        ) : null}
      </div>
    </section>
  );
}
