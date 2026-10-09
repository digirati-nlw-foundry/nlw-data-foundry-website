import { createIiifAstroServer } from "iiif-hss/astro/server";

export const iiif = createIiifAstroServer({preferDevBuild:!import.meta.env.PROD});
