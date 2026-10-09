import { getVersionHistory } from "./data";
import { formatBytes, formatDate, formatLabel } from "./format";
import { useDatasetBlockLanguage, useDatasetBlockText } from "./i18n";
import { Empty, Section } from "./parts/Section";
import type { DatasetBlockProps } from "./types";

export function VersionHistory({
  frontmatter,
  language: languageProp,
}: DatasetBlockProps) {
  const language = useDatasetBlockLanguage(languageProp);
  const text = useDatasetBlockText(language);
  const versions = getVersionHistory(frontmatter);

  return (
    <Section title={text("versionHistory")}>
      {versions.length === 0 ? (
        <Empty message={text("noVersionHistory")} />
      ) : (
        <ol className="dsb-timeline">
          {versions.map((version) => {
            const released = formatDate(version.releaseDate, language);
            const size = formatBytes(version.totalSizeBytes, text("bytes"));
            const formats = version.fileFormats.map(
              (format) => formatLabel(format) ?? text("unknown"),
            );
            return (
              <li data-current={version.isCurrent} key={version.versionId}>
                <div className="dsb-timeline-head">
                  <span>
                    {text("version")} {version.versionId}
                  </span>
                  {version.isCurrent ? (
                    <span className="dsb-badge dsb-badge--accent">
                      {text("current")}
                    </span>
                  ) : null}
                  {released.iso ? (
                    <time dateTime={released.iso}>{released.label}</time>
                  ) : null}
                </div>
                <p className="dsb-timeline-meta">
                  {text.count("files", version.fileCount)} ·{" "}
                  {formats.join(", ")} ·{" "}
                  <span title={size.exact ?? undefined}>{size.label}</span>
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </Section>
  );
}
