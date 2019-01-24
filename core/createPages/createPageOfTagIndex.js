const path = require('path');

const IndexTemplate = path.resolve('src/templates/Index.js');

module.exports = async (arg) => {
    const { graphql, actions } = arg;
    const { createPage } = actions;

    const {
        data: {
            site: {
                siteMetadata: {
                    tagCountPerPageInTagIndex: tagsPerPage
                },
            },
            allTag: { edges: tags },
        },
    } = await graphql(`
        {
            site {
                siteMetadata {
                    tagCountPerPageInTagIndex
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

    const pageCount = (tags.length % tagsPerPage === 0) ? tags.length / tagsPerPage : tags.length / tagsPerPage + 1;

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        const start = pageIndex * tagsPerPage;
        const end = Math.min(start + tagsPerPage, tags.length);

        const pageTags = tags.slice(start, end);

        postsByTags = pageTags.map(async tag => {
            const {
                data: {
                    allMarkdownRemark: { edges: posts },
                },
            } = await graphql(`
                {
                    allMarkdownRemark(
                        filter: { fields: { tags: { in: ["${tag.node.id}"] } } }
                        sort: { fields: [fields___birthTime], order: DESC}
                        limit: 5
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
            return { tag: tag, posts: posts }
        });

        let path = 'tags';

        if (pageIndex > 0) {
            path = `tags/${pageIndex}`
        }

        createPage({
            path: path,
            component: IndexTemplate,
            context: {
                index: pageIndex,
                pageCount: pageCount,
                tags: pageTags,
                postsByTags: postsByTags,
            },
        });
    }
};
