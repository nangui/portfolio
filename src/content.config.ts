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
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    featured: z.boolean().optional().default(true),
    demoUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    image: z.string().optional(),
    role: z.string().optional(),
    period: z.string().optional(),
  }),
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
