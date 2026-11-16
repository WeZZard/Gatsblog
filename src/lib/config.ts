import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export interface IndexingItem {
  name: string;
  isEnabled: boolean;
}

export interface NavigationItem {
  name: string;
  slug?: string;
  weight: number;
  isVisible?: boolean;
}

export interface SocialItem {
  name: string;
  icon: string;
  link: string;
}

export interface PaginationItem {
  indexName: string;
  itemsPerPage: number;
}

export interface SiteConfig {
  site: {
    title: string;
    owner: string;
    url: string;
    lang: string;
    description: string;
    keywords: string[];
    license: string;
    indexing: IndexingItem[];
    slogans: string[];
    footerMessages: string[];
  };
  navigation: {
    createsNavigationItemsForCategories: boolean;
    overwritingCategoryNavigationItems: NavigationItem[];
    customNavigationItems: NavigationItem[];
  };
  social: SocialItem[];
  pagination: PaginationItem[];
}

let cachedConfig: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
  if (cachedConfig) return cachedConfig;

  const configPath = path.resolve(process.cwd(), 'config/config.yml');
  const raw = fs.readFileSync(configPath, 'utf-8');
  cachedConfig = yaml.load(raw) as SiteConfig;
  return cachedConfig;
}

export function getItemsPerPage(indexName: string): number {
  const config = getSiteConfig();
  const entry = config.pagination?.find(p => p.indexName === indexName);
  return entry?.itemsPerPage ?? 8;
}

export function isIndexingEnabled(name: string): boolean {
  const config = getSiteConfig();
  const entry = config.site.indexing?.find(i => i.name === name);
  return entry?.isEnabled ?? false;
}
