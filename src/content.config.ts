import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Collection Projets
const projects = defineCollection({
  loader: glob({ 
    pattern: '**/*.md', 
    base: './src/content/projects' 
  }),
  schema: z.object({
    slug: z.string(),
    // Support for both single title/description and translated versions
    // At least one title must be provided (title or title_fr/title_en)
    title: z.string().optional(),
    title_fr: z.string().optional(),
    title_en: z.string().optional(),
    // At least one description must be provided
    description: z.string().optional(),
    description_fr: z.string().optional(),
    description_en: z.string().optional(),
    stack: z.array(z.string()),
    featured: z.boolean().optional().default(true),
    demoUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    image: z.string().optional(),
    role: z.string().optional(),
    role_fr: z.string().optional(),
    role_en: z.string().optional(),
    period: z.string().optional(),
    period_fr: z.string().optional(),
    period_en: z.string().optional(),
  }).refine(
    (data) => data.title || data.title_fr || data.title_en,
    { message: "At least one title (title, title_fr, or title_en) must be provided" }
  ).refine(
    (data) => data.description || data.description_fr || data.description_en,
    { message: "At least one description (description, description_fr, or description_en) must be provided" }
  ),
});

// Collection Blog
const blog = defineCollection({
  loader: glob({ 
    pattern: '**/*.md', 
    base: './src/content/blog' 
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().optional().default('Adonai Nangui'),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = { projects, blog };
