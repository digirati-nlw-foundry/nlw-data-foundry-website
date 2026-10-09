import type { ReactNode } from "react";
import { getDatasetFacts } from "./data";
import { formatBytes, formatDate } from "./format";
import { useDatasetBlockLanguage, useDatasetBlockText } from "./i18n";
import { Section } from "./parts/Section";
import type { DatasetBlockProps } from "./types";

export function DatasetFacts({
  frontmatter,
  language: languageProp,
}: DatasetBlockProps) {
  const language = useDatasetBlockLanguage(languageProp);
  const text = useDatasetBlockText(language);
  const facts = getDatasetFacts(frontmatter);
  const size = formatBytes(facts.totalSizeBytes, text("bytes"));
  const ingested = formatDate(facts.ingestedAt, language);

  const rows: { label: string; value: ReactNode }[] = [
    {
      label: text("datasetId"),
      value: <span className="dsb-mono">{facts.datasetId ?? "—"}</span>,
    },
    {
      label: text("version"),
      value:
        facts.targetVersion !== null ? (
          <span className="dsb-badge dsb-badge--accent">
            v{facts.targetVersion}
          </span>
        ) : (
          "—"
        ),
    },
    { label: text("title"), value: facts.title ?? "—" },
    { label: text("license"), value: facts.license ?? "—" },
    { label: text("fileCount"), value: facts.totalFileCount },
    {
      label: text("totalSize"),
      value: <span title={size.exact ?? undefined}>{size.label}</span>,
    },
    { label: text("formats"), value: facts.fileFormats.join(", ") || "—" },
    {
      label: text("ingested"),
      value: ingested.iso ? (
        <time dateTime={ingested.iso}>{ingested.label}</time>
      ) : (
        ingested.label
      ),
    },
  ];

  return (
    <Section title={text("datasetFacts")}>
      {facts.description ? (
        <p className="dsb-lead">{facts.description}</p>
      ) : null}
      <dl className="dsb-facts">
        {rows.map((row) => (
          <div className="dsb-fact" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
