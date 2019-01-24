const path = require('path');
const assert = require('assert');
const { getHomePageTitle } = require("./utils");

const IndexTemplate = path.resolve('src/templates/Index.js');

module.exports = async (args) => {
    const { graphql, actions } = args;

    const {
        data: {
            site: {
                siteMetadata: {
                    keywords: siteKeywords,
                    description: siteDescription
                },
            },
            allPost: { edges: posts },
        },
    } = await graphql(`
        {
            site {
                siteMetadata {
                    keywords
                    description
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

    const { createPage } = actions;

    const postPerPage = 8;

    const pageCount =
        posts.length % postPerPage === 0
            ? posts.length / postPerPage
            : Math.floor(posts.length / postPerPage) + 1;

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        const start = pageIndex * postPerPage;
        const end = Math.min(start + postPerPage, posts.length);

        const postsInRange = posts.slice(start, end);

        const items = await Promise.all(
            postsInRange.map(async post => {
                const {
                    data: {
                        allMdx: { edges: mdxDocuments },
                    },
                } = await graphql(`
                    {
                        allMdx( filter: {id: {eq: "${post.node.parent.id}" } } ) {
                            edges {
                                node {
                                    excerpt
                                }
                            }
                        }
                    }
                `);

                const tags = await Promise.all(
                    post.node.tags.map(async nodeId => {
                        const {
                            data: {
                                allTag: { edges: tags },
                            },
                        } = await graphql(`
                            {
                                allTag( filter: { id: {eq: "${nodeId}" } } ) {
                                    edges {
                                        node {
                                            name
                                            slug
                                        }
                                    }
                                }
                            }
                        `);

                        if (tags.length === 0) {
                            throw `No tag found for tag node id: "${nodeId}".`
                        } else if (tags.length === 1) {
                            const tag = tags[0];
                            const name = tag.node.name;
                            const slug = tag.node.slug;
                            assert(typeof name === 'string');
                            assert(typeof slug === 'string');
                            return {
                                name: name,
                                slug: slug,
                            }
                        } else {
                            throw `Multiple tag found for tag node id: "${nodeId}".`
                        }
                    })
                );

                const {
                    data: {
                        allCategory: { edges: categories },
                    },
                } = await graphql(`
                    {
                        allCategory( filter: { id: { eq: "${post.node.category}" } } ) {
                            edges {
                                node {
                                    name
                                    slug
                                }
                            }
                        }
                    }
                `);

                let category;

                if (categories.length === 0) {
                    throw `No category found for category node id: "${nodeId}".`
                } else if (categories.length === 1) {
                    const _category = categories[0];
                    const name = _category.node.name;
                    const slug = _category.node.slug;
                    assert(typeof name === 'string');
                    assert(typeof slug === 'string');
                    category = {
                        name: name,
                        slug: slug,
                    }
                } else {
                    throw `Multiple category found for category node id: "${nodeId}".`
                }

                if (mdxDocuments.length === 0) {
                    throw `No relative MDX document found for post: "${post.slug}".`
                } else if (mdxDocuments.length === 1) {
                    const mdxDocument = mdxDocuments[0];
                    return {
                        title: post.node.title,
                        // subtitle: post.node.subtitle,
                        createdTime: post.node.createdTime,
                        tags: tags,
                        category: category,
                        excerpt: mdxDocument.node.excerpt || "<i>The content is intentionally blank.</i>",
                        slug: post.node.slug,
                    }
                } else {
                    throw `Multiple relative MDX document found for post: "${post.slug}".`
                }
            })
        );

        let path = `/`;

        if (pageIndex > 0) {
            path = `/${pageIndex}`
        }

        createPage({
            path: path,
            component: IndexTemplate,
            context: {
                itemName: `PostExcerpt`,
                layoutName: `PostListLayout`,
                pageTitle: getHomePageTitle(pageIndex),
                showsPageTitle: false,
                keywords: siteKeywords,
                description: siteDescription,
                items: items,
                paginationInfo: {
                    index: pageIndex,
                    pageCount: pageCount,
                    previousPageTitle: "Earlier Posts",
                    nextPageTitle: "Later Posts",
                }
            },
        })
    }
};
