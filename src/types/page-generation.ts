// TypeScript interfaces for page generation system
// These interfaces must exactly match the legacy JavaScript data structures

import { GatsbyNode } from 'gatsby';

// Core Gatsby types
export interface CreatePagesArgs {
  graphql: Function;
  actions: {
    createPage: Function;
  };
  [key: string]: any;
}

export interface GraphQLResult<T = any> {
  data?: T;
  errors?: any[];
}

// Site configuration types
export interface SiteConfig {
  site: {
    indexing: Array<{
      name: string;
      isEnabled: boolean;
    }>;
    lang: string;
    keywords: string[];
    description: string;
    license: string;
  };
}

// Content node types
export interface PostNode {
  id: string;
  slug: string;
  lang: string;
  isLocalized: boolean;
  title: string;
  createdTime: string;
  category: string;
  tags: string[];
}

export interface PageNode {
  id: string;
  slug: string;
  lang: string;
  isLocalized: boolean;
  title: string;
  createdTime: string;
}

export interface CategoryNode {
  name: string;
  slug: string;
}

export interface TagNode {
  name: string;
  slug: string;
}

export interface LocaleNode {
  identifier: string;
  slug: string;
  name: string;
}

// MDX metadata types
export interface MDXMetadataArgs {
  node: {
    internal: { type: string };
    frontmatter: {
      title?: string;
      date?: string;
      lang?: string;
      isPublished?: string | boolean;
      [key: string]: any;
    };
    parent: string;
    rawBody: string;
  };
  getNode: Function;
}

export interface MDXRelativePathMetadata {
  name: string;
  lang?: string;
  isLocalized: boolean;
  isIndex: boolean;
  createdTime?: Date;
  slug: string;
  relativePath: string;
  documentType: 'Post' | 'Page';
}

export interface MDXMetadata {
  documentType: 'Post' | 'Page';
  relativePath: string;
  title: string;
  isIndex: boolean;
  isPublished: boolean;
  createdTime: Date;
  slug: string;
  lang: string;
  isLocalized: boolean;
}

// GraphQL query result types
export interface AllPostQueryResult {
  allPost: {
    edges: Array<{
      node: PostNode;
    }>;
  };
}

export interface AllPageQueryResult {
  allPage: {
    edges: Array<{
      node: PageNode;
    }>;
  };
}

export interface ConfigQueryResult {
  config: SiteConfig;
}

// Page creation context types
export interface PostPageContext {
  postId: string;
  earlierPostId: string | null;
  laterPostId: string | null;
}

export interface IndexPageContext {
  slug: string;
  locale: LocaleNode | null;
  title: string | null;
  subtitle?: string;
  showsPageTitle: boolean;
  keywords: string[];
  description: string;
  items: string[];
  paginationInfo: {
    basePath: string;
    pageIndex: number;
    pagesCount: number;
    previousPageTitle: string;
    nextPageTitle: string;
    currentPage: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPagePath?: string;
    previousPagePath?: string;
  };
}

// Page creation arguments
export interface CreatePostIndexPagesArgs {
  createPage: Function;
  siteKeywords: string[];
  siteDescription: string;
  locale: LocaleNode | null;
  items: string[];
  itemsPerPage: number;
  createPageTitle: (locale: LocaleNode | null, pageIndex: number) => string | null;
  createPagePath: (locale: LocaleNode | null, pageIndex: number) => string;
  showsPageTitle: boolean;
  previousPageTitle: string;
  nextPageTitle: string;
}

export interface CreatePagesArgsExtended {
  createPagesArgs: CreatePagesArgs;
  pendingSchemaData: {
    tags: TagNode[];
    categories: CategoryNode[];
    locales: (LocaleNode | null)[];
  };
  indexingConfig: Array<{
    name: string;
    isEnabled: boolean;
  }>;
  siteLang: string;
  siteKeywords: string[];
  siteDescription: string;
  defaultLicense: string;
}

// Page metadata types
export interface PageMetadata {
  name: string;
  getPageTitle: (locale: LocaleNode | null, pageIndex: number) => string | null;
  getPagePath: (locale: LocaleNode | null, pageIndex: number) => string;
  getPreviousPageTitle: (locale?: LocaleNode | null) => string;
  getNextPageTitle: (locale?: LocaleNode | null) => string;
}

export interface CategoryPageMetadata {
  name: string;
  getPageTitle: (category: CategoryNode, locale: LocaleNode | null, pageIndex: number) => string | null;
  getPagePath: (category: CategoryNode, locale: LocaleNode | null, pageIndex: number) => string;
  getPreviousPageTitle: (locale?: LocaleNode | null) => string;
  getNextPageTitle: (locale?: LocaleNode | null) => string;
}

export interface TagPageMetadata {
  name: string;
  getPageTitle: (tag: TagNode, locale: LocaleNode | null, pageIndex: number) => string | null;
  getPagePath: (tag: TagNode, locale: LocaleNode | null, pageIndex: number) => string;
  getPreviousPageTitle: (locale?: LocaleNode | null) => string;
  getNextPageTitle: (locale?: LocaleNode | null) => string;
}

// Node creation types
export interface CreateNodeArgs {
  parent: string;
  nodeIdBase: string;
  nodeContent: string;
  getNode: Function;
  createNode: Function;
  createNodeId: Function;
  createContentDigest: Function;
  createParentChildLink: Function;
}

export interface CreatePostNodeArgs extends CreateNodeArgs {
  post: {
    title: string;
    createdTime: Date;
    isLocalized: boolean;
    lang: string;
    slug: string;
    file: string;
  };
}

export interface CreatePageNodeArgs extends CreateNodeArgs {
  page: {
    title: string;
    createdTime: Date;
    isLocalized: boolean;
    lang: string;
    slug: string;
    file: string;
  };
}

// Utility types
export interface FindPostArgs {
  posts: Array<{ node: PostNode }>;
  fromIndex: number;
  fromPost: { node: PostNode };
}

export interface PaginationOptions {
  itemsCount: number;
  itemsPerPage: number;
}

export interface PaginationResult {
  pagesCount: number;
  pagesOccupied: number;
}

// Function type definitions
export type CreatePagesFunction = (args: CreatePagesArgsExtended) => Promise<void>;
export type CreatePostPagesFunction = (args: CreatePagesArgsExtended) => Promise<void>;
export type CreateIndexPagesFunction = (args: CreatePagesArgsExtended) => Promise<void>;
export type ItemsPerPageFunction = (indexPageName: string, graphql: Function) => Promise<number>;