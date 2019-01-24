const path = require('path');

const IndexTemplate = path.resolve('src/templates/Index.js');

module.exports = async (arg) => {
    const { graphql, actions } = arg;
    const { createPage } = actions;

    const {
        data: {
            site: {
                siteMetadata: {
                    postCountPerPageInCategory: postPerPage
                },
            },
            allCategory: { edges: categories },
        },
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
                        name
                        slug
                    }
                }
            }
        }
    `);

    categories.forEach(async category => {
        const {
            data: {
                allMarkdownRemark: { edges: posts },
            },
        } = await graphql(`
            {
                allMarkdownRemark(
                    filter: { fields: { category: { eq: "${category.node.name}" } } }
                    sort: { fields: [fields___birthTime], order: DESC}
                ) {
                    edges {
                        node {
                            fields {
                                title
                                slug
                                tags
                                category
                            }
                        }
                    }
                }
            }
        `);

        const pageCount =
            posts.length % postPerPage === 0
                ? posts.length / postPerPage
                : posts.length / postPerPage + 1;

        for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
            const start = pageIndex * postPerPage;
            const end = Math.min(start + postPerPage, posts.length);

            const pagePosts = posts.slice(start, end);

            let path = category.node.slug;

            if (pageIndex > 0) {
                path = `${path}/${pageIndex}`
            }

            createPage({
                path: path,
                component: IndexTemplate,
                context: {
                    index: pageIndex,
                    pageCount: pageCount,
                    category: category.node.name,
                    posts: pagePosts,
                },
            })
        }
    })
};