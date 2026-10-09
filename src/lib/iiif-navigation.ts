import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Locale } from "./i18n";
import { iiif } from "./iiif.server";

export type IiifSnippet = {id:string;type:"Manifest"|"Collection";label?:Record<string,string[]>;thumbnail?:Array<{id:string}>;"hss:totalItems"?:number;"hss:slug":string};
export function iiifLabel(label:Record<string,string[]>|undefined,locale:Locale,fallback:string) {
  return label?.[locale]?.[0] || label?.en?.[0] || label?.cy?.[0] || label?.none?.[0] || Object.values(label||{}).flat()[0] || fallback;
}
export function iiifResourcePath(resource:IiifSnippet,locale:Locale) {
  return `/${locale}/iiif/resources/${resource["hss:slug"].split("/").map(encodeURIComponent).join("/")}`;
}
export function iiifStoreId(resource:IiifSnippet) {
  const slug=resource["hss:slug"];
  return slug?.startsWith("stores/")?slug.slice("stores/".length):null;
}
async function readOutput(path:string) {
  try {return JSON.parse(await readFile(join(iiif.resolveBuildDir(),path),"utf8"));}
  catch(error) {if((error as NodeJS.ErrnoException).code==="ENOENT") return null;throw error;}
}
// Dataset membership and public paths come from HSS artifacts. Nested collections resolve through HSS.
export async function getIiifResource(slug:string) {
  const resources=await iiif.getResources() as Record<string,IiifSnippet>|null;
  const resource=resources?.[slug];
  if(!resource) return null;
  const meta=await readOutput(`${slug}/meta.json`);
  const byId=new Map(Object.values(resources||{}).map(resource=>[resource.id,resource]));
  const children=(resource.type==="Collection"?meta?.["hss:runtime"]?.children||[]:[]).flatMap((id:string)=>byId.has(id)?[byId.get(id)!]:[]);
  const source=meta?.["hss:runtime"]?.source?.url || meta?.url || resource.id;
  return {resource,meta,children:children as IiifSnippet[],source};
}
