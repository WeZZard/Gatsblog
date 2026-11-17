import { defineCollection } from 'astro:content';
import {
  createWpwPagesLoader,
  createWpwPostsLoader,
  wpwCommonSchema,
} from '@wezzard/wpw/astro';

const posts = defineCollection({
  loader: createWpwPostsLoader(),
  schema: wpwCommonSchema,
});

const pages = defineCollection({
  loader: createWpwPagesLoader(),
  schema: wpwCommonSchema,
});

export const collections = { posts, pages };
