import { createElement, type ComponentType } from "react";
import {
  blockRegistry,
  datasetBlockNames,
  type DatasetBlockFrontmatter,
  type DatasetBlockLocale,
} from "../components/markdown/datasets";

/**
 * MDX `components` map for `<DatasetFacts />` etc. Astro renders each React
 * component in its own root, so frontmatter and locale are bound by closure
 * rather than React context.
 */
export function bindDatasetBlocks(
  frontmatter: DatasetBlockFrontmatter,
  language: DatasetBlockLocale,
) {
  return Object.fromEntries(
    datasetBlockNames.map((name) => {
      const Block = blockRegistry[name];
      const Bound: ComponentType = () =>
        createElement(Block, { frontmatter, language });
      Bound.displayName = name;
      return [name, Bound];
    }),
  );
}
