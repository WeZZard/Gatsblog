const createIndexPages = require('./_create-index-pages');
const { category: page } = require('./page-meta');
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

    const { categories, locales } = pendingSchemaData;

    await Promise.all(locales.map(async (locale) => {
        const args = {
            locale,
            categories,
            graphql,
            createPage,
            siteLang,
            siteKeywords,
            siteDescription,
        };
        await _createPageForCategoriesForLocale(args)
    }));
};

const _createPageForCategoriesForLocale = async (args) => {
    const {
        categories,
        locale,
        siteLang,
        siteKeywords,
        siteDescription,
        graphql,
        createPage
    } = args;

    const itemsPerPage = await itemsPerPageForIndexPageName(page.name, graphql);

    await Promise.all(
        categories.map(async (category) => {
            const postFilter = locale
                ? (locale.identifier === siteLang
                        ? `lang: { in: [ null, "${locale.identifier}" ] }`
                        : `lang: { eq: "${locale.identifier}" }`
                ) : 'isLocalized: { eq: false }';

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
            } = allPost || { edges: [] };

            createIndexPages({
                createPage : createPage,
                siteKeywords,
                siteDescription,
                locale: locale,
                itemComponentName : page.itemComponentName,
                layoutComponentName: page.layoutComponentName,
                items: posts.map(post => post.node),
                itemsPerPage,
                createPageTitle: (locale, pageIndex) => page.getPageTitle(category, locale, pageIndex),
                createPagePath: (locale, pageIndex) => page.getPagePath(category, locale, pageIndex),
                showsPageTitle: true,
                previousPageTitle: page.getPreviousPageTitle(locale),
                nextPageTitle: page.getNextPageTitle(locale),
            });
        })
    );
};
