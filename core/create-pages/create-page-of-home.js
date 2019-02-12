const createIndexPages = require('./_create-index-pages');
const { home: page } = require('./page-meta');
const { itemsPerPageForIndexPageName } = require('../config');

module.exports = async (args) => {
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
        locales.map(async (locale) => {
            const postFilter = locale
                ? (locale.identifier === siteLang
                        ? `filter: { lang: { in: [ null, "${locale.identifier}" ] } }`
                        : `filter: { lang: { eq: "${locale.identifier}" } }`
                ) : 'filter: { isLocalized: { eq: false } }';

            const result = await graphql(`
            {
                allPost(
                    ${postFilter}
                    sort: { fields: [createdTime], order: DESC }
                ) {
                    edges {
                        node {
                            slug
                            title
                            subtitle
                            createdTime
                            documentIdentifier
                            tags
                            category
                            file {
                                childMdx {
                                    excerpt(pruneLength: 300)
                                }
                            }
                        }
                    }
                }
            }
            `);

            if (result.errors) {
                throw result.errors
            }

            const {
                data: {
                    allPost,
                },
            } = result;

            const {
                edges: posts
            } = (allPost || { edges: [] });

            const itemsPerPage = await itemsPerPageForIndexPageName(page.name, graphql);

            createIndexPages({
                createPage : createPage,
                siteKeywords,
                siteDescription,
                locale: locale,
                itemComponentName : page.itemComponentName,
                layoutComponentName: page.layoutComponentName,
                items: posts.map(post => post.node),
                itemsPerPage,
                createPageTitle: page.getPageTitle,
                createPagePath: page.getPagePath,
                showsPageTitle: false,
                previousPageTitle: page.getPreviousPageTitle(locale),
                nextPageTitle: page.getNextPageTitle(locale),
            });
        })
    );
};
