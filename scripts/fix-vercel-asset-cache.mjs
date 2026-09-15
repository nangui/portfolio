// Post-build fix for the Vercel adapter output.
//
// @astrojs/vercel appends its long-term cache header route for hashed assets
// (`^/_astro/(.*)$` -> `cache-control: public, max-age=31536000, immutable`) after the
// `{ handle: "filesystem" }` phase. Static files are served during that phase, so the header
// never reaches them and production serves /_astro/* with `max-age=0`.
// This moves the route to the top of the routing table, where it applies to every request.
//
// At the top, `^/_astro/(.*)$` also matched URLs that are not files: 404s and trailing-slash 308
// redirects under /_astro/ were cached as immutable for a year. The route is therefore narrowed
// to the exact files the build wrote to .vercel/output/static/_astro, recomputed on every build.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const configUrl = new URL('../.vercel/output/config.json', import.meta.url);
const assetsDir = fileURLToPath(new URL('../.vercel/output/static/_astro', import.meta.url));

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

const assetRouteIndex = routes.findIndex(isAssetCacheRoute);

if (assetRouteIndex === -1 || !routes.some((route) => route.handle === 'filesystem')) {
  console.warn('[fix-vercel-asset-cache] asset cache route or filesystem phase not found, skipping');
  process.exit(0);
}

const listFiles = (dir, prefix = '') =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? listFiles(path.join(dir, entry.name), `${prefix}${entry.name}/`)
      : [`${prefix}${entry.name}`]
  );

const assetFiles = existsSync(assetsDir) ? listFiles(assetsDir).sort() : [];
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');

const [assetRoute] = routes.splice(assetRouteIndex, 1);

if (assetFiles.length === 0) {
  writeFileSync(configUrl, `${JSON.stringify({ ...config, routes }, null, 2)}\n`);
  console.warn('[fix-vercel-asset-cache] no files in _astro, removed the asset cache route');
  process.exit(0);
}

const narrowedRoute = { ...assetRoute, src: `^/_astro/(?:${assetFiles.map(escapeRegExp).join('|')})$` };
routes.unshift(narrowedRoute);
writeFileSync(configUrl, `${JSON.stringify({ ...config, routes }, null, 2)}\n`);
console.log(`[fix-vercel-asset-cache] cache route limited to ${assetFiles.length} _astro files and moved before the filesystem phase`);
