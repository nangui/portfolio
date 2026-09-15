// Security headers sent with every response of the site.
//
// Every resource is served from the site's own origin: pages, /_astro assets and self-hosted fonts,
// /_vercel/image and the proxied Vercel Analytics script and beacon.
//
// Inline scripts stay allowed: Astro inlines its small module scripts and the theme script runs
// inline before first paint to avoid a flash. The site has no user input to inject into, so the
// policy mainly locks down where resources may come from, framing, plugins and <base>.
// Inline styles stay allowed for the style attributes Shiki writes on code blocks.
const directives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'font-src': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'connect-src': ["'self'"],
  'manifest-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
};

// Preview deployments load the Vercel Toolbar and Comments, which need these sources
// (https://vercel.com/docs/vercel-toolbar/managing-toolbar#using-a-content-security-policy).
// VERCEL_ENV is set during Vercel builds; local builds keep the production policy.
const previewToolbarSources = {
  'script-src': ['https://vercel.live'],
  'connect-src': ['https://vercel.live', 'wss://ws-us3.pusher.com'],
  'img-src': ['https://vercel.live', 'https://vercel.com', 'blob:'],
  'frame-src': ['https://vercel.live'],
  'style-src': ['https://vercel.live'],
  'font-src': ['https://vercel.live', 'https://assets.vercel.com'],
};

const buildContentSecurityPolicy = (isPreview) => {
  const merged = Object.fromEntries(Object.entries(directives).map(([name, sources]) => [name, [...sources]]));
  if (isPreview) {
    for (const [name, sources] of Object.entries(previewToolbarSources)) {
      merged[name] = [...(merged[name] ?? []), ...sources];
    }
  }
  return [...Object.entries(merged).map(([name, sources]) => `${name} ${sources.join(' ')}`), 'upgrade-insecure-requests'].join('; ');
};

export const isPreviewBuild = process.env.VERCEL_ENV === 'preview';

export const securityHeaders = {
  'content-security-policy': buildContentSecurityPolicy(isPreviewBuild),
  'x-content-type-options': 'nosniff',
  // Kept alongside frame-ancestors for browsers that ignore CSP framing rules
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'cross-origin-opener-policy': 'same-origin',
};
