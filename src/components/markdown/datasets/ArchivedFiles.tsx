import { getArchivedVersions } from "./data";
import { useDatasetBlockLanguage, useDatasetBlockText } from "./i18n";
import { FileTable } from "./parts/FileTable";
import { Empty, Section } from "./parts/Section";
import type { DatasetBlockProps } from "./types";

export function ArchivedFiles({
  frontmatter,
  language: languageProp,
}: DatasetBlockProps) {
  const language = useDatasetBlockLanguage(languageProp);
  const text = useDatasetBlockText(language);
  const versions = getArchivedVersions(frontmatter);

  return (
    <Section title={text("archivedFiles")}>
      {versions.length === 0 ? (
        <Empty message={text("noArchivedFiles")} />
      ) : (
        <div>
          {versions.map((version) => (
            <details key={version.versionId}>
              <summary>
                {text("version")} {version.versionId}
                <span className="dsb-muted">
                  {text.count("files", version.files.length)}
                </span>
              </summary>
              <div className="dsb-panel">
                <FileTable files={version.files} language={language} />
              </div>
            </details>
          ))}
        </div>
      )}
    </Section>
  );
}
