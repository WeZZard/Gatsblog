const createPagesByIndexing = require('./_createPagesByIndexing');
const {
    getHomePageTitle,
    getHomePagePath,
    makePostExcerpt,
} = require("./utils");

module.exports = async (args) => {
    const { graphql, actions } = args;
    const { createPage } = actions;

    const {
        data: {
            site: {
                siteMetadata: {
                    postCountPerPageInHome: postExcerptPerPage
                },
            },
            allPost: { edges: posts },
        }
    } = await graphql(`
        {
            site {
                siteMetadata {
                    postCountPerPageInHome
                }
            }
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

    await createPagesByIndexing({
        graphql: graphql,
        createPage : createPage,
        itemComponentName : 'PostExcerpt',
        layoutComponentName: 'PostListLayout',
        primitiveItems: posts,
        itemsPerPage: postExcerptPerPage,
        createItem: async (post) => await makePostExcerpt(post, graphql),
        createPageTitle: getHomePageTitle,
        createPagePath: getHomePagePath,
        showsPageTitle: false,
        previousPageTitle: "Earlier Posts",
        nextPageTitle: "Later Posts",
    });
};
