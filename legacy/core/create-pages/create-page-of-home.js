const createPostIndexPages = require('./_create-post-index-pages');
const { home: meta } = require('./post-index-meta');
const { itemsPerPageForIndexPageName } = require('../config');

module.exports = async args => {
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

  await Promise.all(
    locales.map(async locale => {
      const postFilter = locale
        ? locale.identifier === siteLang
          ? `filter: { lang: { in: [ null, "${locale.identifier}" ] } }`
          : `filter: { lang: { eq: "${locale.identifier}" } }`
        : 'filter: { isLocalized: { eq: false } }';

      const result = await graphql(`{
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

      if (result.errors) {
        throw result.errors;
      }

      const {
        data: { allPost },
      } = result;

      const { edges: posts } = allPost || { edges: [] };

      const itemsPerPage = await itemsPerPageForIndexPageName(
        meta.name,
        graphql,
      );

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
};
