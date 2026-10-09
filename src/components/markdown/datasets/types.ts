import type { DatasetBlockFrontmatter } from "./data";
import type { DatasetBlockLocale } from "./i18n";

export type DatasetBlockProps = {
  frontmatter: DatasetBlockFrontmatter;
  /** Defaults to the ambient `DatasetBlockLanguage`, then `en`. */
  language?: DatasetBlockLocale;
};
