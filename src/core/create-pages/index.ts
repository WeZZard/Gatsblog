import {
  CreatePagesArgs,
  CreatePagesArgsExtended,
  GraphQLResult,
  ConfigQueryResult,
  SiteConfig,
  LocaleNode,
  CategoryNode,
  TagNode,
} from '../../types/page-generation';

import createPageOfHome from './create-page-of-home';
import createPageOfCategories from './create-page-of-categories';
import createPageOfTags from './create-page-of-tags';
import createPagesForEachCategory from './create-pages-for-each-category';
import createPagesForEachTag from './create-pages-for-each-tag';
import createPagesForEachPage from './create-pages-for-each-page';
import createPagesForEachPost from './create-pages-for-each-post';

// Import TypeScript node creation functions
import {
  createNodesForEachTag,
  createNodesForEachCategory,
  createNodesForEachLocale,
} from '../create-node';

export default async function createPages(args: CreatePagesArgs): Promise<void> {
  const { graphql } = args;

  // Create taxonomy nodes - preserve exact function calls
  const tags: TagNode[] = await createNodesForEachTag(args as any);
  const categories: CategoryNode[] = await createNodesForEachCategory(args as any);
  const locales: LocaleNode[] = await createNodesForEachLocale(args as any);

  // Load site configuration - preserve exact GraphQL query
  const result: GraphQLResult<ConfigQueryResult> = await graphql(`
    {
      config: configYaml {
        site {
          indexing {
            name
            isEnabled
          }
          lang
          keywords
          description
          license
        }
      }
    }
  `);

  // Preserve exact error handling pattern
  if (result.errors) {
    throw result.errors;
  }

  const {
    data,
  } = result;

  const config = data?.config;

  // Preserve exact fallback configuration structure
  const {
    site: {
      indexing: indexingConfig,
      lang: siteLang,
      keywords: siteKeywords,
      description: siteDescription,
      license: defaultLicense,
    },
  } = config || {
    site: {
      indexing: [],
      lang: 'en-US',
      keywords: [],
      description: '',
      license: 'cc4.0-by-nc-nd',
    },
  };

  // Preserve exact comment and pending schema data structure
  // Gatsby.js doesn't immediately update the GraphQL schema after you create
  // the node, we have to pass the following pending data to the create-page
  // function series.
  const pendingSchemaData = {
    tags: tags,
    categories: categories,
    locales: [
      null,
      ...locales.filter(locale => locale.identifier !== siteLang),
    ],
  };

  // Create extended arguments object - preserve exact structure
  const createPagesArgs: CreatePagesArgsExtended = {
    createPagesArgs: args,
    pendingSchemaData,
    indexingConfig,
    siteLang,
    siteKeywords,
    siteDescription,
    defaultLicense,
  };

  // All TypeScript functions imported at top of file

  // Preserve exact Promise.all parallel execution pattern - now with all TypeScript functions
  await Promise.all(
    [
      createPageOfHome,
      createPageOfCategories,
      createPageOfTags,
      createPagesForEachCategory,
      createPagesForEachTag,
      createPagesForEachPage,
      createPagesForEachPost,
    ].map(async createPages => await createPages(createPagesArgs)),
  );
}