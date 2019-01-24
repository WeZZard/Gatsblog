const createPagesByIndexing = require('./_createPagesByIndexing');
const {
    getHomePageTitle,
    getHomePagePath,
} = require("./utils");

const { makePostExcerptPayloadWithPost } = require('../makePayloads');
const { getItemsPerPageInLocation } = require('../Config');

const _createPageOfHomeForLocale = async (args) => {
    const { locale, graphql, createPage } = args;

    const {
        data: {
            allPost: { edges: posts },
        }
    } = await graphql(`
        {
            allPost(
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

    const itemsPerPage = await getItemsPerPageInLocation('Home', graphql);

    await createPagesByIndexing({
        graphql: graphql,
        createPage : createPage,
        locale: locale,
        itemComponentName : 'PostExcerpt',
        layoutComponentName: 'PostListLayout',
        primitiveItems: posts,
        itemsPerPage: itemsPerPage,
        createItem: async (post) => await makePostExcerptPayloadWithPost(post, graphql),
        createPageTitle: getHomePageTitle,
        createPagePath: getHomePagePath,
        showsPageTitle: false,
        previousPageTitle: "Earlier Posts",
        nextPageTitle: "Later Posts",
    });
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
            await _createPageOfHomeForLocale(args)
        })
    )
};
