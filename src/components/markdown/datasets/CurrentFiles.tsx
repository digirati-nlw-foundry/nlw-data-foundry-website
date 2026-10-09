import { getCurrentFiles } from "./data";
import { useDatasetBlockLanguage, useDatasetBlockText } from "./i18n";
import { FileTable } from "./parts/FileTable";
import { Section } from "./parts/Section";
import type { DatasetBlockProps } from "./types";

export function CurrentFiles({
  frontmatter,
  language: languageProp,
}: DatasetBlockProps) {
  const language = useDatasetBlockLanguage(languageProp);
  const text = useDatasetBlockText(language);

  return (
    <Section title={text("currentFiles")}>
      <FileTable files={getCurrentFiles(frontmatter)} language={language} />
    </Section>
  );
}
