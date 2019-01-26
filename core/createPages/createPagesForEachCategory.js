const createIndexPages = require('./_createIndexPages');
const { category: page } = require('./pageMetadata');
const { makePostExcerptPayload } = require('../Payload');
const { getItemsPerPageInIndexWithName } = require('../config');

module.exports = async (args, pendingSchemaData) => {
    const { graphql, actions } = args;
    const { createPage } = actions;

    const { tags, categories, locales } = pendingSchemaData;

    await Promise.all(locales.map(async (locale) => {
        const args = {
            categories: categories,
            tags: tags,
            locale: locale,
            graphql: graphql,
            createPage: createPage,
        };
        await _createPageForCategoriesForLocale(args)
    }));
};

const _createPageForCategoriesForLocale = async (args) => {
    const { categories, tags, locale, graphql, createPage } = args;

    const itemsPerPage = await getItemsPerPageInIndexWithName(page.name, graphql);

    await Promise.all(categories.map(async (category) => {
        const result = await graphql(`
            {
                allPost(
                    filter: { 
                        category: { eq: "${category.name}" }
                        locale: { eq: "${locale.identifier}" } 
                    }
                    sort: { fields: [createdTime], order: DESC }
                ) {
                    edges {
                        node {
                            title
                            subtitle
                            createdTime
                            tags
                            category
                            slug
                            parent {
                                id
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

        await createIndexPages({
            graphql: graphql,
            createPage : createPage,
            locale: locale,
            itemComponentName : page.itemComponentName,
            layoutComponentName: page.layoutComponentName,
            primitiveItems: posts || [],
            itemsPerPage: itemsPerPage,
            createItem: async (post) => await makePostExcerptPayload({
                post: post,
                graphql: graphql,
                tags: tags,
                categories: categories,
            }),
            createPageTitle: (locale, pageIndex) => page.getPageTitle(category, locale, pageIndex),
            createPagePath: (locale, pageIndex) => page.getPagePath(category, locale, pageIndex),
            showsPageTitle: true,
            previousPageTitle: page.getPreviousPageTitle(locale),
            nextPageTitle: page.getNextPageTitle(locale),
        });
    }));
};
