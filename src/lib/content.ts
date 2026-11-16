import { getCollection, type CollectionEntry } from 'astro:content';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { getSiteConfig, isIndexingEnabled } from './config';
import { parsePageRelativePath, parsePostRelativePath } from './metadata';

export interface PostItem {
  entry: CollectionEntry<'posts'>;
  id: string;
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

export function toKebabCase(input: string): string {
  const kebab = input
    .replace(/['\u2019]/g, '')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .replace(/([0-9])([a-zA-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return kebab || encodeURIComponent(input.toLowerCase());
}

const excerptProcessor = unified().use(remarkParse).use(remarkGfm).use(remarkMath);

interface MdastLikeNode {
  type?: string;
  value?: string;
  children?: MdastLikeNode[];
}

function collectExcerptTextNodes(node: MdastLikeNode, out: string[]): void {
  if (!node || typeof node !== 'object') return;
  if (
    node.type === 'yaml' ||
    node.type === 'toml' ||
    node.type === 'footnoteDefinition' ||
    node.type === 'html'
  ) {
    return;
  }
  if ((node.type === 'text' || node.type === 'inlineCode') && typeof node.value === 'string') {
    out.push(node.value);
    return;
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      collectExcerptTextNodes(child, out);
    }
  }
}

function pruneUnderscoreString(str: string, length: number, pruneStr = '…'): string {
  if (str.length <= length) return str;
  const tmpl = (c: string) => (c.toUpperCase() !== c.toLowerCase() ? 'A' : ' ');
  let template = str.slice(0, length + 1).replace(/.(?=\W*\w*$)/g, tmpl);
  if (/\w\w/.test(template.slice(template.length - 2))) {
    template = template.replace(/\s*\S+$/, '');
  } else {
    template = template.slice(0, template.length - 1).trimEnd();
  }
  return (template + pruneStr).length > str.length
    ? str
    : str.slice(0, template.length) + pruneStr;
}

export function extractExcerpt(body: string | undefined, maxLength: number): string {
  if (!body) return '';
  // Match gatsby-mdx MDAST text-node joining + underscore.string prune(str, maxLength, '…')
  const cleaned = body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^\s*import\s+.*?from\s+['"].*?['"];?\s*$/gm, '')
    .replace(/^\s*export\s+.*?;?\s*$/gm, '');
  const tree = excerptProcessor.parse(cleaned) as MdastLikeNode;
  const nodes: string[] = [];
  collectExcerptTextNodes(tree, nodes);
  return pruneUnderscoreString(nodes.join(' '), maxLength, '…');
}

function isEntryPublished(value: boolean | string | undefined): boolean {
  if (value === undefined) return true;
  if (typeof value === 'boolean') return value;
  return value === 'true';
}

function getPostRelativePath(entry: CollectionEntry<'posts'>): string {
  const fp = entry.filePath || entry.id;
  const markerPosts = 'content/_posts/';
  const idxPosts = fp.indexOf(markerPosts);
  if (idxPosts !== -1) return fp.slice(idxPosts + markerPosts.length);

  const markerMyWorks = 'MyWorks/';
  const idxMyWorks = fp.indexOf(markerMyWorks);
  if (idxMyWorks !== -1) return fp.slice(idxMyWorks + markerMyWorks.length);

  return fp;
}

export async function getAllPosts(): Promise<PostItem[]> {
  const config = getSiteConfig();
  const entries = await getCollection('posts');
  const maxPostDateRaw =
    process.env.PARITY_MAX_POST_DATE || import.meta.env.PARITY_MAX_POST_DATE;
  const maxPostTimestamp = maxPostDateRaw ? new Date(maxPostDateRaw).getTime() : null;

  const items: PostItem[] = entries
    .map(entry => {
      const parsed = parsePostRelativePath(getPostRelativePath(entry));
      const isPublished = isEntryPublished(entry.data.isPublished);
      const lang = parsed.lang || entry.data.lang || config.site.lang || 'en-US';
      const slug = entry.data.slug || parsed.slug;
      const fullPath = parsed.isLocalized ? `/${lang}${slug}` : slug;
      const createdTime =
        entry.data.date || parsed.createdTime || new Date(0);

      return {
        entry,
        id: entry.id,
        title: entry.data.title || parsed.name,
        subtitle: entry.data.subtitle,
        createdTime,
        lastModifiedTime: entry.data.lastModifiedTime,
        isPublished,
        isLocalized: parsed.isLocalized,
        lang,
        slug,
        fullPath,
        category: entry.data.category || 'Uncategorized',
        tags: entry.data.tags || [],
        keywords: entry.data.keywords || [],
        license: entry.data.license || config.site.license,
        excerpt: extractExcerpt(entry.body, 300),
      };
    })
    .filter(
      item =>
        item.isPublished &&
        (maxPostTimestamp === null || item.createdTime.getTime() <= maxPostTimestamp),
    )
    .sort((a, b) => b.createdTime.getTime() - a.createdTime.getTime());

  return items;
}

export async function getAllPages(): Promise<PageItem[]> {
  const config = getSiteConfig();
  const entries = await getCollection('pages');

  return entries
    .map(entry => {
      const parsed = parsePageRelativePath(entry.id);
      const isPublished = isEntryPublished(entry.data.isPublished);
      const lang = parsed.lang || entry.data.lang || config.site.lang || 'en-US';
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
      config.navigation.overwritingCategoryNavigationItems.map(i => [i.name, i]),
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
