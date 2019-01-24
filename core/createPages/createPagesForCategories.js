const createPagesByIndexing = require('./_createPagesByIndexing');
const {
    getCategoryPageTitle,
    getCategoryPagePath,
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
            allCategory: { edges: categories },
        }
    } = await graphql(`
        {
            site {
                siteMetadata {
                    postCountPerPageInCategory
                }
            }
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

    await Promise.all(categories.map(async (category) => {
        const tuple = await graphql(`
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

        const {
            data: {
                allPost: { edges: posts },
            },
        } = tuple;

        await createPagesByIndexing({
            graphql: graphql,
            createPage : createPage,
            itemComponentName : 'PostExcerpt',
            layoutComponentName: 'PostListLayout',
            primitiveItems: posts,
            itemsPerPage: postExcerptPerPage,
            createItem: async (post) => await makePostExcerpt(post, graphql),
            createPageTitle: (pageIndex) => getCategoryPageTitle(category.node.name, pageIndex),
            createPagePath: (pageIndex) => getCategoryPagePath(category.node.slug, pageIndex),
            showsPageTitle: true,
            previousPageTitle: "Earlier Posts",
            nextPageTitle: "Later Posts",
        });
    }));
};
