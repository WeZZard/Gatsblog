const createPagesByIndexing = require('./_createPagesByIndexing');
const { tag: page } = require('./pageMetadata');
const { makePostExcerptPayloadWithPost } = require('../payload');
const { getItemsPerPageInLocation } = require('../config');

module.exports = async (args) => {
    const { graphql, actions } = args;
    const { createPage } = actions;

    const {
        data: {
            allTag: { edges: tags },
        }
    } = await graphql(`
        {
            allTag {
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

    await Promise.all(tags.map(async (tag) => {
        const {
            data: {
                allPost: { edges: posts },
            },
        } = await graphql(`
            {
                allPost(
                    filter: { tags: { in: "${tag.node.id}" } }
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
            itemComponentName : page.itemComponentName,
            layoutComponentName: page.layoutComponentName,
            primitiveItems: posts,
            itemsPerPage: itemsPerPage,
            createItem: async (post) => await makePostExcerptPayloadWithPost(post, graphql),
            createPageTitle: (pageIndex) => page.getPageTitle(tag.node.name, pageIndex),
            createPagePath: (pageIndex) => page.getPagePath(tag.node.slug, pageIndex),
            showsPageTitle: true,
            previousPageTitle: page.getPreviousPageTitle,
            nextPageTitle: page.getNextPageTitle,
        });
    }));
};
