const path = require("path");

const IndexTemplate = path.resolve('src/templates/Index.js');

module.exports = async (arg) => {
    const { graphql, actions } = arg;
    const { createPage } = actions;

    const {
        data: {
            site: {
                siteMetadata: {
                    postCountPerPageInTag: postsPerPage
                },
            },
            allTag: { edges: tags },
        },
    } = await graphql(`
        {
            site {
                siteMetadata {
                    postCountPerPageInTag
                }
            }
            allTag {
                edges {
                    node {
                        name
                        slug
                    }
                }
            }
        }
    `);

    tags.forEach(async tag => {
        const {
            data: {
                allMarkdownRemark :{ edges: posts },
            },
        } = await graphql(`
            {
                allMarkdownRemark(
                    filter: { fields: { tags: { in: ["${tag.node.name}"] } } }
                    sort: { fields: [fields___birthTime], order: DESC}
                ) {
                    edges {
                        node {
                            id
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

        const pageCount = (posts.length % postsPerPage === 0) ? posts.length / postsPerPage : posts.length / postsPerPage + 1;

        for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
            const start = pageIndex * postsPerPage;
            const end = Math.min(start + postsPerPage, posts.length);

            const pagePosts = posts.slice(start, end);

            let path = tag.node.slug;

            if (pageIndex > 0) {
                path = `${path}/${pageIndex}`
            }

            createPage({
                path: path,
                component: IndexTemplate,
                context: {
                    index: pageIndex,
                    pageCount: pageCount,
                    tag: tag.node.name,
                    posts: pagePosts,
                },
            });
        }
    })
};