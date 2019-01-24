const createPagesByIndexing = require('./_createPagesByIndexing');
const { tags: page } = require('./pageMetadata');
const { makeTagSummaryPayloadWithTag } = require('../payload');

const _createPageOfTagForLocale = async (args) => {
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

    const itemsPerPage = await getItemsPerPageInLocation(page.location, graphql);

    await Promise.all(categories.map(async (category) => {
        const { data: { allPost } } = await graphql(`
            {
                allPost(
                    filter: { 
                        locale: { eq: "${locale.node.id}" } 
                    }
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

        const { edges: posts } = allPost || { edges: [] };

        await createPagesByIndexing({
            graphql: graphql,
            createPage : createPage,
            locale: locale,
            itemComponentName : page.itemComponentName,
            layoutComponentName: page.layoutComponentName,
            primitiveItems: posts,
            itemsPerPage: itemsPerPage,
            createItem: async (post) => await makePostExcerptPayloadWithPost(post, graphql),
            createPageTitle: (locale, pageIndex) => page.getPageTitle(category, locale, pageIndex),
            createPagePath: (locale, pageIndex) => page.getPagePath(category, locale, pageIndex),
            showsPageTitle: true,
            previousPageTitle: page.getPreviousPageTitle(locale),
            nextPageTitle: page.getNextPageTitle(locale),
        });
    }));
};

module.exports = async (args) => {
    const { graphql, actions } = args;
    const { createPage } = actions;

    const { data: { allLocale: { edges: locales } } } = await graphql(`
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
            await _createPageOfTagForLocale(args)
        })
    )
};
