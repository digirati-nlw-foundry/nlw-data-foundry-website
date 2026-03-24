import type { CollectionEntry } from "astro:content";
import { createContext } from "@astropub/context";

export const [Provider, getContext] =
  createContext<{ frontmatter: CollectionEntry<"dataCards">['data'] }>();
