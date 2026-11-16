import fs from 'node:fs';
import path from 'node:path';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

function resolvePostsBase(): string {
  const submoduleDir = path.resolve(process.cwd(), 'content/_posts');
  if (fs.existsSync(submoduleDir)) {
    const entries = fs.readdirSync(submoduleDir).filter(e => !e.startsWith('.'));
    if (entries.length > 0) {
      return './content/_posts';
    }
  }
  const siblingDir = path.resolve(process.cwd(), '../MyWorks');
  if (fs.existsSync(siblingDir)) {
    return '../MyWorks';
  }
  return './content/_posts';
}

const commonSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  date: z.coerce.date().optional(),
  lang: z.string().optional(),
  isPublished: z.union([z.boolean(), z.string()]).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  license: z.string().optional(),
  slug: z.string().optional(),
  lastModifiedTime: z.coerce.date().optional(),
});

const posts = defineCollection({
  loader: glob({
    pattern: [
      '**/*.{md,mdx}',
      '!**/README.md',
      '!**/CLAUDE.md',
      '!**/AGENTS.md',
      '!.pi/**',
      '!.cursor/**',
    ],
    base: resolvePostsBase(),
    generateId: ({ entry }) => entry,
  }),
  schema: commonSchema,
});

const pages = defineCollection({
  loader: glob({
    pattern: ['**/*.{md,mdx}', '!_posts/**'],
    base: './content',
    generateId: ({ entry }) => entry,
  }),
  schema: commonSchema,
});

export const collections = { posts, pages };
