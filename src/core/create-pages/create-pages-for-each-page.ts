import path from 'path';
import debug from 'debug';
import {
  CreatePagesArgsExtended,
  GraphQLResult,
  AllPageQueryResult,
  PageNode,
  StaticPageContext,
} from '../../types/page-generation';

const Template = path.resolve('src/templates/Page.tsx');

export default async function createPagesForEachPage(
  args: CreatePagesArgsExtended
): Promise<void> {
  const { createPagesArgs } = args;
  const { graphql, actions } = createPagesArgs;
  const { createPage } = actions;

  // Preserve exact GraphQL query structure
  const result: GraphQLResult<AllPageQueryResult> = await graphql(`
    {
      allPage(sort: { fields: [createdTime], order: DESC }) {
        edges {
          node {
            id
            slug
            lang
            isLocalized
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

  const { allPage } = data || {};
  const { edges: pages } = allPage || { edges: [] };

  // Preserve exact Promise.all parallel execution pattern
  await Promise.all(
    pages.map(async (pageNode: { node: PageNode }) => {
      // Preserve exact locale slug logic
      const localeSlug = pageNode.node.isLocalized
        ? `/${pageNode.node.lang}`
        : '';

      const originalPath = [localeSlug, pageNode.node.slug]
        .filter(_ => _)
        .join('');

      // Preserve exact paths array structure
      let paths = [originalPath];

      // Preserve exact duplicate path logic for non-localized pages
      if (!pageNode.node.isLocalized && pageNode.node.lang) {
        const localizedPath = `/${pageNode.node.lang}/${pageNode.node.slug}`;
        paths.push(localizedPath);
      }

      // Preserve exact path creation loop
      paths.forEach(path => {
        // Preserve exact debug statement
        debug(`Create page for page: ${path}.`);

        // Preserve exact context structure
        const context: StaticPageContext = {
          pageId: pageNode.node.id,
        };

        // Create the page - preserve exact function call
        createPage({
          path: path,
          component: Template,
          context: context,
        });
      });
    }),
  );
}