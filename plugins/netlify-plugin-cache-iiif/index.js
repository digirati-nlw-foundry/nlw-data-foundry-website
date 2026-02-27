const IIIF_CACHE_PATH = ".iiif";

export const onPreBuild = async ({ utils }) => {
  const restored = await utils.cache.restore(IIIF_CACHE_PATH);

  if (restored) {
    console.log(`[iiif-cache] Restored ${IIIF_CACHE_PATH} from Netlify cache.`);
  } else {
    console.log(`[iiif-cache] No existing cache found for ${IIIF_CACHE_PATH}.`);
  }
};

export const onPostBuild = async ({ utils }) => {
  const saved = await utils.cache.save(IIIF_CACHE_PATH);

  if (saved) {
    console.log(`[iiif-cache] Saved ${IIIF_CACHE_PATH} to Netlify cache.`);
  } else {
    console.log(
      `[iiif-cache] Skipped caching ${IIIF_CACHE_PATH} (directory missing).`,
    );
  }
};
