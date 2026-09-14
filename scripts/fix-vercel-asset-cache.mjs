// Post-build fix for the Vercel adapter output.
//
// @astrojs/vercel appends its long-term cache header route for hashed assets
// (`^/_astro/(.*)$` -> `cache-control: public, max-age=31536000, immutable`) after the
// `{ handle: "filesystem" }` phase. Static files are served during that phase, so the header
// never reaches them and production serves /_astro/* with `max-age=0`.
// This moves the route to the top of the routing table, where it applies to every request.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const configUrl = new URL('../.vercel/output/config.json', import.meta.url);

if (!existsSync(configUrl)) {
  console.warn('[fix-vercel-asset-cache] .vercel/output/config.json not found, skipping');
  process.exit(0);
}

const config = JSON.parse(readFileSync(configUrl, 'utf8'));
const routes = Array.isArray(config.routes) ? config.routes : [];

const isAssetCacheRoute = (route) =>
  typeof route.src === 'string' &&
  route.src.startsWith('^/_astro/') &&
  route.headers &&
  Object.keys(route.headers).some((key) => key.toLowerCase() === 'cache-control');

const filesystemIndex = routes.findIndex((route) => route.handle === 'filesystem');
const assetRouteIndex = routes.findIndex(isAssetCacheRoute);

if (assetRouteIndex === -1 || filesystemIndex === -1) {
  console.warn('[fix-vercel-asset-cache] asset cache route or filesystem phase not found, skipping');
  process.exit(0);
}

if (assetRouteIndex < filesystemIndex) {
  console.log('[fix-vercel-asset-cache] asset cache route already runs before the filesystem phase');
  process.exit(0);
}

const [assetRoute] = routes.splice(assetRouteIndex, 1);
routes.unshift(assetRoute);
writeFileSync(configUrl, `${JSON.stringify({ ...config, routes }, null, 2)}\n`);
console.log(`[fix-vercel-asset-cache] moved ${assetRoute.src} before the filesystem phase`);
