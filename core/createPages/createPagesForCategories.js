const createPagesByIndexing = require('./_createPagesByIndexing');
const { category: page } = require('./pageMetadata');
const { makePostExcerptPayloadWithPost } = require('../payload');
const { getItemsPerPageInLocation } = require('../config');

const _createPageForCategoriesForLocale = async (args) => {
    const { locale, graphql, createPage } = args;

    const {
        data: {
            allCategory: { edges: categories },
        }
    } = await graphql(`
        {
            allCategory {
                edges {
                    node {
                        id
                        name
                        slug
                    }
                }
            }
        }
    `);

    const itemsPerPage = getItemsPerPageInLocation(page.location, graphql);

    await Promise.all(categories.map(async (category) => {
        const {
            data: {
                allPost: { edges: posts },
            },
        } = await graphql(`
            {
                allPost(
                    filter: { category: { eq: "${category.node.id}" } }
                    sort: { fields: [createdTime], order: DESC }
                ) {
                    edges {
                        node {
                            title
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

        await createPagesByIndexing({
            graphql: graphql,
            createPage : createPage,
            locale: locale,
            itemComponentName : page.itemComponentName,
            layoutComponentName: page.layoutComponentName,
            primitiveItems: posts,
            itemsPerPage: itemsPerPage,
            createItem: async (post) => await makePostExcerptPayloadWithPost(post, graphql),
            createPageTitle: (pageIndex) => page.getPageTitle(category.node.name, pageIndex),
            createPagePath: (pageIndex) => page.getPagePath(category.node.slug, pageIndex),
            showsPageTitle: true,
            previousPageTitle: page.getPreviousPageTitle,
            nextPageTitle: page.getNextPageTitle,
        });
    }));
};

module.exports = async (args) => {
    const { graphql, actions } = args;
    const { createPage } = actions;

    const {
        data: {
            allLocale: { edges: locales },
        }
    } = await graphql(`
        {
            allLocale {
                edges {
                    node {
                        identifier
                        slug
                    }
                }
            }
        }
    `);

    await Promise.all(
        locales.map(async (locale) => {
            const args = {
                locale: locale,
                graphql: graphql,
                createPage: createPage,
            };
            await _createPageForCategoriesForLocale(args)
        })
    )
};
