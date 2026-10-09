import { isAbsolute, relative, resolve, sep } from "node:path";
import { existsSync, realpathSync } from "node:fs";

export function contentDirectory(collection, root = process.env.CONTENT_ROOT || "./src/content") {
  return resolve(root, collection);
}

export function localizedFileMatch(filePath, collection, root) {
  if (!filePath) return null;
  const canonical = path => existsSync(path) ? realpathSync(path) : resolve(path);
  const filename = relative(canonical(contentDirectory(collection, root)), canonical(filePath));
  if (isAbsolute(filename) || filename.startsWith(`..${sep}`)) return null;
  return filename.split(sep).join("/").match(/^(.+)\.(en|cy)\.(md|mdx)$/);
}
