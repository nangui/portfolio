// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Legacy unprefixed project URLs (/projects/<slug>-<locale>) point to the localized pages.
// Declared as config redirects so Vercel serves real 301s instead of an HTML "Redirecting..." page.
const projectsDir = new URL('./src/content/projects/', import.meta.url);
const legacyProjectRedirects = Object.fromEntries(
  readdirSync(projectsDir)
    .filter((file) => file.endsWith('.md'))
    .flatMap((file) => {
      const slug = readFileSync(new URL(file, projectsDir), 'utf8').match(/^slug:\s*["']?([^"'\n]+?)["']?\s*$/m)?.[1];
      const match = slug?.match(/^(.+)-(fr|en)$/);
      return match ? [[`/projects/${slug}`, `/${match[2]}/projects/${match[1]}`]] : [];
    })
);

// https://astro.build/config
export default defineConfig({
  site: 'https://adonainangui.dev',
  adapter: vercel({
    imageService: true,
  }),
  redirects: {
    '/': '/fr',
    ...legacyProjectRedirects,
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
