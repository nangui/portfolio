// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

/**
 * @param {URL} dir
 * @param {string} file
 * @returns {string | undefined}
 */
const readSlug = (dir, file) =>
  readFileSync(new URL(file, dir), 'utf8').match(/^slug:\s*["']?([^"'\n]+?)["']?\s*$/m)?.[1];

// Legacy unprefixed project URLs (/projects/<slug>-<locale>) point to the localized pages.
// Declared as config redirects so Vercel serves real 301s instead of an HTML "Redirecting..." page.
const projectsDir = new URL('./src/content/projects/', import.meta.url);
const legacyProjectRedirects = Object.fromEntries(
  readdirSync(projectsDir)
    .filter((file) => file.endsWith('.md'))
    .flatMap((file) => {
      const slug = readSlug(projectsDir, file);
      const match = slug?.match(/^(.+)-(fr|en)$/);
      return match ? [[`/projects/${slug}`, `/${match[2]}/projects/${match[1]}`]] : [];
    })
);

// Legacy unprefixed blog URLs duplicated the localized pages; articles are written in French.
const blogDir = new URL('./src/content/blog/', import.meta.url);
const legacyBlogRedirects = Object.fromEntries(
  readdirSync(blogDir)
    .filter((file) => file.endsWith('.md'))
    .flatMap((file) => {
      const slug = readSlug(blogDir, file) ?? file.replace(/\.md$/, '');
      return [[`/blog/${slug}`, `/fr/blog/${slug}`]];
    })
);

// The blog is written in French only: English blog URLs point to the French articles.
const englishBlogRedirects = Object.fromEntries([
  ['/en/blog', '/fr/blog'],
  ...Object.values(legacyBlogRedirects).map((frenchPath) => [frenchPath.replace(/^\/fr\//, '/en/'), frenchPath]),
]);

// https://astro.build/config
export default defineConfig({
  site: 'https://adonainangui.dev',
  // Canonical URLs have no trailing slash. With 'never', the Vercel adapter redirects
  // "/page/" to "/page" and lets config redirects match both forms.
  trailingSlash: 'never',
  image: { layout: 'constrained' },
  // Google Fonts downloaded at build time and served from the site: no render-blocking third-party
  // stylesheet. Same families and weights as the former Google Fonts @import.
  // display 'optional': with 'swap', text painted in the fallback font jumped when the web fonts
  // arrived on slower connections (CLS up to 0.24) despite the metric-adjusted fallbacks. The
  // preloaded fonts are used when they arrive in time, and from cache on the next pages otherwise.
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.google(),
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
      display: 'optional',
    },
    {
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      provider: fontProviders.google(),
      weights: [500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
      display: 'optional',
    },
  ],
  adapter: vercel({
    imageService: true,
  }),
  redirects: {
    '/': '/fr',
    '/blog': '/fr/blog',
    ...legacyProjectRedirects,
    ...legacyBlogRedirects,
    ...englishBlogRedirects,
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        // github-dark-default keeps code comments readable (4.5:1+); github-dark comments were 3:1
        dark: 'github-dark-default',
      },
      defaultColor: false,
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
