// Post-build step for the Vercel adapter output.
//
// @astrojs/vercel only emits headers for Astro's own CSP, and the site deploys through the Build
// Output API, so the security headers are written as the first route of
// .vercel/output/config.json. `continue: true` lets routing go on, so the headers are added to
// every response: pages, assets, redirects and the 404 page.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { securityHeaders } from './security-headers.mjs';

const configUrl = new URL('../.vercel/output/config.json', import.meta.url);

// Fail the build rather than deploy without headers when the adapter output changes shape
const fail = (message) => {
  console.error(`[add-security-headers] ${message}`);
  process.exit(1);
};

if (!existsSync(configUrl)) fail('.vercel/output/config.json not found');

const config = JSON.parse(readFileSync(configUrl, 'utf8'));
if (!Array.isArray(config.routes)) fail('config.json has no routes array');
if (!config.routes.some((route) => route.handle === 'filesystem')) fail('config.json has no filesystem phase');
const routes = config.routes;

const isSecurityRoute = (route) =>
  route.src === '^/.*$' && route.continue === true && route.headers?.['x-content-type-options'];

const withoutPrevious = routes.filter((route) => !isSecurityRoute(route));
const securityRoute = { src: '^/.*$', headers: securityHeaders, continue: true };

writeFileSync(configUrl, `${JSON.stringify({ ...config, routes: [securityRoute, ...withoutPrevious] }, null, 2)}\n`);
console.log(`[add-security-headers] added ${Object.keys(securityHeaders).length} headers to every route`);
