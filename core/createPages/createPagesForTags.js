const createPagesByIndexing = require('./_createPagesByIndexing');
const {
    getTagPageTitle,
    getTagPagePath,
    makePostExcerpt,
} = require("./utils");

module.exports = async (args) => {
    const { graphql, actions } = args;
    const { createPage } = actions;

    const {
        data: {
            site: {
                siteMetadata: {
                    postCountPerPageInCategory: postExcerptPerPage
                },
            },
            allTag: { edges: tags },
        }
    } = await graphql(`
        {
            site {
                siteMetadata {
                    postCountPerPageInCategory
                }
            }
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
            itemsPerPage: postExcerptPerPage,
            createItem: async (post) => await makePostExcerpt(post, graphql),
            createPageTitle: (pageIndex) => getTagPageTitle(tag.node.name, pageIndex),
            createPagePath: (pageIndex) => getTagPagePath(tag.node.slug, pageIndex),
            showsPageTitle: true,
            previousPageTitle: "Previous Page",
            nextPageTitle: "Next Page",
        });
    }));
};
