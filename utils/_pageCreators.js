const path = require("path");
const Index = path.resolve('src/templates/Index.js');
const Post = path.resolve('src/templates/Post.js');

const _createPageForHome = async (graphql, actions) => {
    const { createPage } = actions;

    const {
        data: {
            allMarkdownRemark: { edges: posts },
        },
    } = await graphql(`
            {
                allMarkdownRemark(
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

    const postPerPage = 8;

    const pageCount =
        posts.length % postPerPage === 0
            ? posts.length / postPerPage
            : posts.length / postPerPage + 1;

    for (let i = 0; i < pageCount; i++) {
        const start = pageCount * postPerPage;
        const end = Math.min(start + postPerPage, posts.length);

        const pagePosts = posts.slice(start, end);

        let path = ``;

        if (i > 0) {
            path = `${i}`
        }

        createPage({
            path: path,
            component: Index,
            context: {
                index: i,
                pageCount: pageCount,
                category: category.node.name,
                posts: pagePosts,
            },
        })
    }
};

const _createPageForPosts = async (graphql, actions) => {
    const { createPage } = actions;

    const {
        data: {
            allMarkdownRemark: { edges: posts },
        },
    } = await graphql(`
        {
            allMarkdownRemark(
                sort: { fields: [fields___birthTime], order: DESC }
            ) {
                edges {
                    node {
                        fields {
                            slug
                            category
                            tags
                            birthTime
                            title
                        }
                    }
                }
            }
        }
    `);

    posts.forEach((post, index) => {
        const previous =
            index === posts.length - 1 ? null : posts[index + 1].node;
        const next = index === 0 ? null : posts[index - 1].node;

        createPage({
            path: post.node.fields.slug,
            component: Post,
            context: {
                slug: post.node.fields.slug,
                previous,
                next,
            },
        })
    })
};

const _createPageForCategories = async (graphql, actions) => {
    const { createPage } = actions;

    const {
        data: {
            site: {
                siteMetadata: {
                    postCountPerPageInCategory: postPerPage
                },
            },
        },
    } = await graphql(`
        {
            site {
                siteMetadata {
                    postCountPerPageInCategory
                }
            }
        }
    `);

    const {
        data: {
            allCategory: { edges: categories },
        },
    } = await graphql(`
        {
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
                    filter: { fields: { category: { eq: "${
                        category.node.name
                    }" } } }
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

        for (let i = 0; i < pageCount; i++) {
            const start = pageCount * postPerPage;
            const end = Math.min(start + postPerPage, posts.length);

            const pagePosts = posts.slice(start, end);

            let path = category.node.slug;

            if (i > 0) {
                path = `${path}/${i}`
            }

            createPage({
                path: path,
                component: Index,
                context: {
                    index: i,
                    pageCount: pageCount,
                    category: category.node.name,
                    posts: pagePosts,
                },
            })
        }
    })
};

const _createPageForTagIndex = async (graphql, actions) => {
    const { createPage } = actions;

    const {
        data: {
            site: {
                siteMetadata: {
                    tagCountPerPageInTagIndex: tagsPerPage
                },
            },
        },
    } = await graphql(`
        {
            site {
                siteMetadata {
                    tagCountPerPageInTagIndex
                }
            }
        }
    `);

    const {
        data: {
            allTag: { edges: tags },
        },
    } = await graphql(`
        {
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

    const pageCount = (tags.length % tagsPerPage === 0) ? tags.length / tagsPerPage : tags.length / tagsPerPage + 1;

    for (let i = 0; i < pageCount; i++) {
        const start = pageCount * tagsPerPage;
        const end = Math.min(start + tagsPerPage, tags.length);

        const pageTags = tags.slice(start, end);

        postsByTags = pageTags.map(async tag => {
            const {
                data: {
                    allTag: { edges: posts },
                },
            } = await graphql(`
                {
                    allMarkdownRemark(
                        filter: { fields: { tags: { in: ["${tag.node.name}"] } } }
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

        if (i > 0) {
            path = `tags/${i}`
        }

        createPage({
            path: path,
            component: Index,
            context: {
                index: i,
                pageCount: pageCount,
                tags: pageTags,
                postsByTags: postsByTags,
            },
        });
    }
};

const _createPageForTags = async (graphql, actions) => {
    const { createPage } = actions;

    const {
        data: {
            site: {
                siteMetadata: {
                    postCountPerPageInTag: postsPerPage
                },
            },
        },
    } = await graphql(`
        {
            site {
                siteMetadata {
                    postCountPerPageInTag
                }
            }
        }
    `);

    const {
        data: {
            allTag: { edges: tags },
        },
    } = await graphql(`
        {
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

        for (let i = 0; i < pageCount; i++) {
            const start = pageCount * postsPerPage;
            const end = Math.min(start + postsPerPage, posts.length);

            const pagePosts = posts.slice(start, end);

            let path = tag.node.slug;

            if (i > 0) {
                path = `${path}/${i}`
            }

            createPage({
                path: path,
                component: Index,
                context: {
                    index: i,
                    pageCount: pageCount,
                    tag: tag.node.name,
                    posts: pagePosts,
                },
            });
        }
    })
};

const _pageCreators = [
    _createPageForPosts,
    _createPageForCategories,
    _createPageForTagIndex,
    _createPageForTags,
];

module.exports = (graphql, actions) => {
    return _pageCreators.forEach(fn => {
        fn(graphql, actions);
    });
};
