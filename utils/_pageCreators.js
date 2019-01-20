const path = require("path");

const IndexTemplate = path.resolve('src/templates/Index.js');
const PostTemplate = path.resolve('src/templates/Post.js');
const PageTemplate = path.resolve('src/templates/Page.js');

const _createPageForHome = async (graphql, actions) => {
    const { createPage } = actions;

    const {
        data: {
            site: {
                siteMetadata: {
                    keywords: siteKeywords,
                    description: siteDescription
                },
            },
            allMarkdownRemark: { edges: documents },
        },
    } = await graphql(`
        {
            site {
                siteMetadata {
                    keywords
                    description
                }
            }
            allMarkdownRemark(
                sort: { fields: [fields___birthTime], order: DESC}
            ) {
                edges {
                    node {
                        fields {
                            title
                            birthTime
                            tags
                            category
                            slug
                        }
                        excerpt
                    }
                }
            }
        }
    `);

    const postPerPage = 8;

    const pageCount =
        documents.length % postPerPage === 0
            ? documents.length / postPerPage
            : documents.length / postPerPage + 1;

    const getTitle = (index) => {
        if (index === 0) {
            return `All Posts`
        }
        return `All Posts (Page ${index})`
    };

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        const start = pageIndex * postPerPage;
        const end = Math.min(start + postPerPage, documents.length);

        const items = documents.slice(start, end);

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
                title: getTitle(pageIndex),
                showsTitle: false,
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

const _createPageForMarkdownDocuments = async (graphql, actions) => {
    const { createPage } = actions;

    const {
        data: {
            allMarkdownRemark: { edges: documents },
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
                            documentType
                        }
                        tableOfContents
                        html
                    }
                }
            }
        }
    `);

    const getTemplate = (documentType) => {
        switch (documentType) {
            case "Post":
                return PostTemplate;
            case "Page":
                return PageTemplate;
            default:
                throw `Unexpected document type "${documentType}".`;
        }
    };

    documents.forEach((document, index) => {
        const previous =
            index === documents.length - 1 ? null : documents[index + 1].node;
        const next = index === 0 ? null : documents[index - 1].node;

        createPage({
            path: document.node.fields.slug,
            component: getTemplate(document.node.fields.documentType),
            context: {
                document: document,
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

const _createPageForTagIndex = async (graphql, actions) => {
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

const _pageCreators = [
    _createPageForHome,
    _createPageForMarkdownDocuments,
    _createPageForCategories,
    _createPageForTagIndex,
    _createPageForTags,
];

module.exports = (graphql, actions) => {
    return _pageCreators.forEach(fn => {
        fn(graphql, actions);
    });
};
