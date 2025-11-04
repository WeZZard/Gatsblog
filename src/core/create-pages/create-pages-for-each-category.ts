import {
  CreatePagesArgsExtended,
  GraphQLResult,
  AllPostQueryResult,
  LocaleNode,
  CategoryNode,
  CategoryPageMetadata,
} from '../../types/page-generation';

import createPostIndexPages from './_create-post-index-pages';

// Import legacy configuration functions (will be migrated later)
import { category as meta } from '../metadata/post-index-meta';
import { itemsPerPageForIndexPageName } from '../config';

export default async function createPagesForEachCategory(
  args: CreatePagesArgsExtended
): Promise<void> {
  const {
    createPagesArgs,
    pendingSchemaData,
    siteLang,
    siteKeywords,
    siteDescription,
  } = args;

  const { graphql, actions } = createPagesArgs;
  const { createPage } = actions;
  const { categories, locales } = pendingSchemaData;

  // Preserve exact Promise.all parallel execution pattern
  await Promise.all(
    locales.map(async (locale: LocaleNode | null) => {
      const categoryArgs = {
        locale,
        categories,
        graphql,
        createPage,
        siteLang,
        siteKeywords,
        siteDescription,
      };
      await _createPageForCategoriesForLocale(categoryArgs);
    }),
  );
}

// Preserve exact internal function structure
async function _createPageForCategoriesForLocale(args: {
  categories: CategoryNode[];
  locale: LocaleNode | null;
  siteLang: string;
  siteKeywords: string[];
  siteDescription: string;
  graphql: Function;
  createPage: Function;
}): Promise<void> {
  const {
    categories,
    locale,
    siteLang,
    siteKeywords,
    siteDescription,
    graphql,
    createPage,
  } = args;

  // Preserve exact items per page loading
  const itemsPerPage = await itemsPerPageForIndexPageName(meta.name, graphql);

  // Preserve exact Promise.all parallel execution pattern
  await Promise.all(
    categories.map(async (category: CategoryNode) => {
      // Preserve exact post filtering logic for different locales
      const postFilter = locale
        ? locale.identifier === siteLang
          ? `lang: { in: [ null, "${locale.identifier}" ] }`
          : `lang: { eq: "${locale.identifier}" }`
        : 'isLocalized: { eq: false }';

      // Preserve exact GraphQL query structure with template literal
      const result: GraphQLResult<AllPostQueryResult> = await graphql(`
        {
          allPost(
            filter: { 
              category: { eq: "${category.name}" }
              ${postFilter} 
            }
            sort: { fields: [createdTime], order: DESC }
          ) {
            edges {
              node {
                id
              }
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

      const { allPost } = data || {};
      const { edges: posts } = allPost || { edges: [] };

      // Preserve exact function call structure
      await createPostIndexPages({
        createPage,
        siteKeywords,
        siteDescription,
        locale: locale,
        items: posts.map(post => post.node.id),
        itemsPerPage,
        createPageTitle: (locale, pageIndex) =>
          meta.getPageTitle(category, locale, pageIndex),
        createPagePath: (locale, pageIndex) =>
          meta.getPagePath(category, locale, pageIndex),
        showsPageTitle: true,
        previousPageTitle: meta.getPreviousPageTitle(locale),
        nextPageTitle: meta.getNextPageTitle(locale),
      });
    }),
  );
}