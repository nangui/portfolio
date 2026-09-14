// Security headers sent with every response of the site.
//
// Every resource is served from the site's own origin (pages, /_astro assets, /_vercel/image and
// the proxied Vercel Analytics script and beacon) except Google Fonts: the stylesheet comes from
// fonts.googleapis.com and the font files from fonts.gstatic.com.
//
// Inline scripts stay allowed: Astro inlines its small module scripts and the theme script runs
// inline before first paint to avoid a flash. The site has no user input to inject into, so the
// policy mainly locks down where resources may come from, framing, plugins and <base>.
// Inline styles stay allowed for the style attributes Shiki writes on code blocks.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

export const securityHeaders = {
  'content-security-policy': contentSecurityPolicy,
  'x-content-type-options': 'nosniff',
  // Kept alongside frame-ancestors for browsers that ignore CSP framing rules
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'cross-origin-opener-policy': 'same-origin',
};
