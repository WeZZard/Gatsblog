const createPagesByIndexing = require('./_createPagesByIndexing');
const { home: page } = require('./pageMetadata');
const { makePostExcerptPayloadWithPost } = require('../payload');
const { getItemsPerPageInLocation } = require('../config');

const _createPageOfHomeForLocale = async (args) => {
    const { locale, graphql, createPage } = args;

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

    if (allPost) {
        const { edges: posts } = allPost;

        const itemsPerPage = await getItemsPerPageInLocation(page.location, graphql);

        await createPagesByIndexing({
            graphql: graphql,
            createPage : createPage,
            locale: locale,
            itemComponentName : page.itemComponentName,
            layoutComponentName: page.layoutComponentName,
            primitiveItems: posts,
            itemsPerPage: itemsPerPage,
            createItem: async (post) => await makePostExcerptPayloadWithPost(post, graphql),
            createPageTitle: page.getPageTitle,
            createPagePath: page.getPagePath,
            showsPageTitle: false,
            previousPageTitle: page.getPreviousPageTitle(locale),
            nextPageTitle: page.getNextPageTitle(locale),
        });
    }
};

module.exports = async (args) => {
    const { graphql, actions } = args;
    const { createPage } = actions;
    const { data: { allLocale: { edges: locales } } } = await graphql(`
        {
            allLocale {
                edges {
                    node {
                        id
                        identifier
                        slug
                    }
                }
            }
        }
    `);

    await Promise.all(locales.map(async (locale) => {
        const args = {
            locale: locale,
            graphql: graphql,
            createPage: createPage,
        };
        await _createPageOfHomeForLocale(args)
    }))
};
