const createPagesByIndexing = require('./_createPagesByIndexing');
const {
    getTagPageTitle,
    getTagPagePath,
} = require("./utils");

const { makePostExcerptPayloadWithPost } = require('../makePayloads');
const { getItemsPerPageInLocation } = require('../Config');

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

    const itemsPerPage = getItemsPerPageInLocation('Tags', graphql);

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
            itemComponentName : 'PostExcerpt',
            layoutComponentName: 'PostListLayout',
            primitiveItems: posts,
            itemsPerPage: itemsPerPage,
            createItem: async (post) => await makePostExcerptPayloadWithPost(post, graphql),
            createPageTitle: (pageIndex) => getTagPageTitle(tag.node.name, pageIndex),
            createPagePath: (pageIndex) => getTagPagePath(tag.node.slug, pageIndex),
            showsPageTitle: true,
            previousPageTitle: "Previous Page",
            nextPageTitle: "Next Page",
        });
    }));
};
