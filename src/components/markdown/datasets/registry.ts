import type { JSX } from "react";
import { ArchivedFiles } from "./ArchivedFiles";
import { CurrentFiles } from "./CurrentFiles";
import { DataDictionary } from "./DataDictionary";
import { DatasetFacts } from "./DatasetFacts";
import type { DatasetBlockName } from "./names";
import { RightsUsage } from "./RightsUsage";
import type { DatasetBlockProps } from "./types";
import { VersionHistory } from "./VersionHistory";

/** Single source of truth for `<BlockName />` → component. */
export const blockRegistry: Record<
  DatasetBlockName,
  (props: DatasetBlockProps) => JSX.Element
> = {
  DatasetFacts,
  CurrentFiles,
  ArchivedFiles,
  VersionHistory,
  DataDictionary,
  RightsUsage,
};
