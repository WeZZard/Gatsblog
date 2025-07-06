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

// Import legacy node creation functions (will be migrated later)
const {
  createNodesForEachTag,
  createNodesForEachCategory,
  createNodesForEachLocale,
} = require('../../../legacy/core/create-node');

export default async function createPages(args: CreatePagesArgs): Promise<void> {
  const { graphql } = args;

  // Create taxonomy nodes - preserve exact function calls
  const tags: TagNode[] = await createNodesForEachTag(args);
  const categories: CategoryNode[] = await createNodesForEachCategory(args);
  const locales: LocaleNode[] = await createNodesForEachLocale(args);

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

  // Import TypeScript functions
  const createPageOfHome = require('./create-page-of-home').default;
  const createPagesForEachCategory = require('./create-pages-for-each-category').default;
  const createPagesForEachPost = require('./create-pages-for-each-post').default;

  // Preserve exact Promise.all parallel execution pattern
  await Promise.all(
    [
      createPageOfHome,
      require('./create-page-of-categories'),
      require('./create-page-of-tags'),
      createPagesForEachCategory,
      require('./create-pages-for-each-tag'),
      require('./create-pages-for-each-page'),
      createPagesForEachPost,
    ].map(async createPages => await createPages(createPagesArgs)),
  );
}