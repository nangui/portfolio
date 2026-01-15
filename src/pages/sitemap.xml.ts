import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.href || 'https://adonainangui.dev';
  
  // Get all blog posts
  const blogPosts = await getCollection('blog').catch(() => []);
  
  // Get all projects
  const projects = await getCollection('projects').catch(() => []);
  
  // Static pages
  const staticPages = [
    '',
    '/blog',
  ];
  
  // Generate blog post URLs
  const blogUrls = blogPosts.map((post) => {
    const slug = post.data.slug || post.id.replace(/\.(md|mdx)$/, '');
    return `/blog/${slug}`;
  });
  
  // Generate project URLs
  const projectUrls = projects.map((project) => {
    const slug = project.data.slug || project.id.replace(/\.(md|mdx)$/, '');
    return `/projects/${slug}`;
  });
  
  // Combine all URLs
  const allUrls = [...staticPages, ...blogUrls, ...projectUrls];
  
  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>${url === '' ? 'weekly' : url.startsWith('/blog') ? 'monthly' : 'yearly'}</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
