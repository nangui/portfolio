import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const locales = ['fr', 'en'] as const;

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.href || 'https://adonainangui.dev').replace(/\/$/, '');

  const blogPosts = await getCollection('blog').catch(() => []);
  const projects = await getCollection('projects').catch(() => []);

  const urls = new Set<string>();
  urls.add('/');

  locales.forEach((locale) => {
    urls.add(`/${locale}`);
    urls.add(`/${locale}/blog`);
  });

  blogPosts.forEach((post) => {
    const slug = post.data.slug || post.id.replace(/\.(md|mdx)$/, '');
    locales.forEach((locale) => {
      urls.add(`/${locale}/blog/${slug}`);
    });
  });

  const normalizedProjectSlugs = new Set<string>();
  projects.forEach((project) => {
    const rawSlug = project.data.slug || project.id.replace(/\.(md|mdx)$/, '');
    normalizedProjectSlugs.add(rawSlug.replace(/-(fr|en)$/, ''));
  });

  Array.from(normalizedProjectSlugs).forEach((slug) => {
    locales.forEach((locale) => {
      urls.add(`/${locale}/projects/${slug}`);
    });
  });

  const allUrls = Array.from(urls).sort();

  const getPriority = (url: string): string => {
    if (url === '/' || url === '/fr' || url === '/en') return '1.0';
    if (url.includes('/blog/')) return '0.8';
    if (url.includes('/projects/')) return '0.8';
    return '0.7';
  };

  const getChangeFreq = (url: string): string => {
    if (url === '/' || url === '/fr' || url === '/en') return 'weekly';
    if (url.includes('/blog/')) return 'monthly';
    return 'monthly';
  };

  const now = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map((url) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${getChangeFreq(url)}</changefreq>
    <priority>${getPriority(url)}</priority>
  </url>`)
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
