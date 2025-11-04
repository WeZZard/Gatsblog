const createPostIndexPages = require('./_create-post-index-pages');
const { category: meta } = require('./post-index-meta');
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

  const { categories, locales } = pendingSchemaData;

  await Promise.all(
    locales.map(async locale => {
      const args = {
        locale,
        categories,
        graphql,
        createPage,
        siteLang,
        siteKeywords,
        siteDescription,
      };
      await _createPageForCategoriesForLocale(args);
    }),
  );
};

const _createPageForCategoriesForLocale = async args => {
  const {
    categories,
    locale,
    siteLang,
    siteKeywords,
    siteDescription,
    graphql,
    createPage,
  } = args;

  const itemsPerPage = await itemsPerPageForIndexPageName(meta.name, graphql);

  await Promise.all(
    categories.map(async category => {
      const postFilter = locale
        ? locale.identifier === siteLang
          ? `lang: { in: [ null, "${locale.identifier}" ] }`
          : `lang: { eq: "${locale.identifier}" }`
        : 'isLocalized: { eq: false }';

      const result = await graphql(`
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

      if (result.errors) {
        throw result.errors;
      }

      const {
        data: { allPost },
      } = result;

      const { edges: posts } = allPost || { edges: [] };

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
};
