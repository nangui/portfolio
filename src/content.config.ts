import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Case study blocks rendered as structured sections on the project page.
// Each locale file carries its own language (the .fr file uses *_fr, the .en file *_en).
const titledTextSchema = z.object({ title: z.string(), text: z.string() });

const contributionSchema = z.object({
  title: z.string(),
  role: z.string().optional(),
  share: z.string().optional(),
  stack: z.array(z.string()).optional(),
  summary: z.string(),
  // Rendered as "<strong>title</strong>text": keep any leading space or punctuation in text
  details: z.array(titledTextSchema).optional(),
});

const deliveriesSchema = z.object({
  intro: z.string().optional(),
  items: z.array(titledTextSchema),
  outro: z.string().optional(),
});

const proofSchema = z.object({
  intro: z.string().optional(),
  lead: z.string(),
  text: z.string().optional(),
  note: z.string().optional(),
});

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
    demoUrl: z.url().optional(),
    githubUrl: z.url().optional(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(), // Support for multiple images
    // Share image (Open Graph), used instead of image/images and never shown on the page
    ogImage: z.string().optional(),
    role: z.string().optional(),
    role_fr: z.string().optional(),
    role_en: z.string().optional(),
    period: z.string().optional(),
    period_fr: z.string().optional(),
    period_en: z.string().optional(),
    // Key figures shown on the spotlight card of the projects section
    highlights_fr: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    highlights_en: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    contributions_fr: z.array(contributionSchema).optional(),
    contributions_en: z.array(contributionSchema).optional(),
    decisions_fr: z.array(titledTextSchema).optional(),
    decisions_en: z.array(titledTextSchema).optional(),
    deliveries_fr: deliveriesSchema.optional(),
    deliveries_en: deliveriesSchema.optional(),
    proof_fr: proofSchema.optional(),
    proof_en: proofSchema.optional(),
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
