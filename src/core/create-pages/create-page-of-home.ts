import {
  CreatePagesArgsExtended,
  GraphQLResult,
  AllPostQueryResult,
  LocaleNode,
  PageMetadata,
} from '../../types/page-generation';

import createPostIndexPages from './_create-post-index-pages';

// Import legacy configuration functions (will be migrated later)
import { home as meta } from '../metadata/post-index-meta';
import { itemsPerPageForIndexPageName } from '../config';

export default async function createPageOfHome(
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
  const { locales } = pendingSchemaData;

  // Preserve exact Promise.all parallel execution pattern
  await Promise.all(
    locales.map(async (locale: LocaleNode | null) => {
      // Preserve exact post filtering logic for different locales
      const postFilter = locale
        ? locale.identifier === siteLang
          ? `filter: { lang: { in: [ null, "${locale.identifier}" ] } }`
          : `filter: { lang: { eq: "${locale.identifier}" } }`
        : 'filter: { isLocalized: { eq: false } }';

      // Preserve exact GraphQL query structure
      const result: GraphQLResult<AllPostQueryResult> = await graphql(`{
        allPost(
          ${postFilter}
          sort: { fields: [createdTime], order: DESC }
        ) {
          edges {
            node {
              id
            }
          }
        }
      }`);

      // Preserve exact error handling pattern
      if (result.errors) {
        throw result.errors;
      }

      const {
        data,
      } = result;

      const { allPost } = data || {};
      const { edges: posts } = allPost || { edges: [] };

      // Preserve exact items per page loading
      const itemsPerPage = await itemsPerPageForIndexPageName(
        meta.name,
        graphql,
      );

      // Preserve exact function call structure
      createPostIndexPages({
        createPage: createPage,
        siteKeywords,
        siteDescription,
        locale: locale,
        items: posts.map(post => post.node.id),
        itemsPerPage,
        createPageTitle: meta.getPageTitle,
        createPagePath: meta.getPagePath,
        showsPageTitle: false,
        previousPageTitle: meta.getPreviousPageTitle(locale),
        nextPageTitle: meta.getNextPageTitle(locale),
      });
    }),
  );
}