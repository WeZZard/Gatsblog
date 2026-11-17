import { getCollection, type CollectionEntry } from 'astro:content';
import {
  buildPostHierarchy,
  extractExcerpt,
  isEntryPublished,
  parsePageRelativePath,
  toKebabCase,
} from '@wezzard/wpw';
import { getSiteConfig, isIndexingEnabled } from './config';

export { extractExcerpt, toKebabCase };

export interface PostItem {
  entry: CollectionEntry<'posts'>;
  id: string;
  masterId: string;
  title: string;
  subtitle?: string;
  createdTime: Date;
  lastModifiedTime?: Date;
  isPublished: boolean;
  isLocalized: boolean;
  lang: string;
  slug: string;
  fullPath: string;
  category: string;
  tags: string[];
  keywords: string[];
  license: string;
  excerpt: string;
}

export interface PageItem {
  entry: CollectionEntry<'pages'>;
  id: string;
  title: string;
  subtitle?: string;
  createdTime?: Date;
  lastModifiedTime?: Date;
  isPublished: boolean;
  isLocalized: boolean;
  lang: string;
  slug: string;
  fullPath: string;
  keywords: string[];
  license: string;
  excerpt: string;
}

export interface TaxonomyNode {
  name: string;
  slug: string;
}

export async function getAllPosts(): Promise<PostItem[]> {
  const config = getSiteConfig();
  const entries = await getCollection('posts');
  const maxPostDateRaw =
    process.env.PARITY_MAX_POST_DATE || import.meta.env.PARITY_MAX_POST_DATE;
  const maxPostTimestamp = maxPostDateRaw
    ? new Date(maxPostDateRaw).getTime()
    : null;

  const hierarchy = buildPostHierarchy(
    entries.map(entry => ({
      id: entry.id,
      filePath: entry.filePath,
      body: entry.body,
      data: entry.data,
      entry,
    })),
    {
      defaultLang: config.site.lang || 'en-US',
      defaultCategory: 'Uncategorized',
      defaultLicense: config.site.license,
    },
  );

  return hierarchy.posts
    .filter(
      post =>
        !post.isImaginaryMaster &&
        Boolean(post.entry) &&
        post.isPublished &&
        (maxPostTimestamp === null ||
          post.createdTime.getTime() <= maxPostTimestamp),
    )
    .map(post => ({
      entry: post.entry!,
      id: post.id,
      masterId: post.masterId,
      title: post.title,
      subtitle: post.subtitle,
      createdTime: post.createdTime,
      lastModifiedTime: post.entry!.data.lastModifiedTime,
      isPublished: post.isPublished,
      isLocalized: post.isLocalized,
      lang: post.lang,
      slug: post.blogSlug,
      fullPath: post.blogFullPath,
      category: post.categoryName,
      tags: post.tagNames,
      keywords: post.keywords,
      license: post.license || config.site.license,
      excerpt: extractExcerpt(post.body, 300),
    }))
    .sort((a, b) => b.createdTime.getTime() - a.createdTime.getTime());
}

export async function getAllPages(): Promise<PageItem[]> {
  const config = getSiteConfig();
  const entries = await getCollection('pages');

  return entries
    .map(entry => {
      const parsed = parsePageRelativePath(entry.id);
      const isPublished = isEntryPublished(entry.data.isPublished);
      const lang =
        parsed.lang || entry.data.lang || config.site.lang || 'en-US';
      const slug = entry.data.slug || parsed.slug;
      const fullPath = parsed.isLocalized ? `/${lang}${slug}` : slug;

      return {
        entry,
        id: entry.id,
        title: entry.data.title || parsed.name,
        subtitle: entry.data.subtitle,
        createdTime: entry.data.date,
        lastModifiedTime: entry.data.lastModifiedTime,
        isPublished,
        isLocalized: parsed.isLocalized,
        lang,
        slug,
        fullPath,
        keywords: entry.data.keywords || [],
        license: entry.data.license || config.site.license,
        excerpt: extractExcerpt(entry.body, 100),
      };
    })
    .filter(item => item.isPublished);
}

export function getAllTags(posts: PostItem[]): TaxonomyNode[] {
  const map = new Map<string, TaxonomyNode>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = `/tag/${toKebabCase(tag)}`;
      if (!map.has(slug)) {
        map.set(slug, { name: tag, slug });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
  );
}

export function getAllCategories(posts: PostItem[]): TaxonomyNode[] {
  const map = new Map<string, TaxonomyNode>();
  for (const post of posts) {
    if (post.category) {
      const slug = `/category/${toKebabCase(post.category)}`;
      if (!map.has(slug)) {
        map.set(slug, { name: post.category, slug });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
  );
}

export interface NavLinkItem {
  name: string;
  slug: string;
  weight: number;
}

export function getNavigationItems(posts: PostItem[]): NavLinkItem[] {
  const config = getSiteConfig();
  const items: NavLinkItem[] = [];

  if (isIndexingEnabled('Tags')) {
    items.push({ name: 'Tags', slug: '/tag', weight: 10 });
  }
  if (isIndexingEnabled('Categories')) {
    items.push({ name: 'Categories', slug: '/category', weight: 10 });
  }

  if (config.navigation.createsNavigationItemsForCategories) {
    const categories = getAllCategories(posts);
    const overrides = new Map(
      config.navigation.overwritingCategoryNavigationItems.map(i => [
        i.name,
        i,
      ]),
    );
    for (const cat of categories) {
      const override = overrides.get(cat.name);
      if (override && override.isVisible === false) continue;
      items.push({
        name: cat.name,
        slug: cat.slug,
        weight: override?.weight ?? 5,
      });
    }
  }

  for (const custom of config.navigation.customNavigationItems || []) {
    if (custom.isVisible === false || !custom.slug) continue;
    items.push({
      name: custom.name,
      slug: custom.slug,
      weight: custom.weight ?? 0,
    });
  }

  return items.sort((a, b) => a.weight - b.weight);
}
