const path = require("path");
const { getHomePageTitle } = require("./utils");

const IndexTemplate = path.resolve('src/templates/Index.js');

async function createPageOfHome(arg) {
    const { graphql, actions } = arg;

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
                sort: { fields: [fields___birthTime], order: DESC}
            ) {
                edges {
                    node 
                        title
                        createdTime
                        tags
                        category
                        slug
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
            : posts.length / postPerPage + 1;

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        const start = pageIndex * postPerPage;
        const end = Math.min(start + postPerPage, posts.length);

        const postsInRange = posts.slice(start, end);

        const items = postsInRange.map(post => {
            const {
                data: {
                    allMdx: { edges: mdxDocuments },
                },
            } = await graphql(`
                {
                    allMdx(
                        filter: { fields: { id: {eq: ${post.parent} } }
                        sort: { fields: [fields___birthTime], order: DESC}
                    ) {
                        edges {
                            node {
                                excerpt
                            }
                        }
                    }
                }
            `);

            if (mdxDocuments.length === 0) {
                throw `No relative MDX document found for post: "${post.slug}".`
            } else if (mdxDocuments.length === 1) {
                const mdxDocument = mdxDocuments[0];
                return {
                    title: post.node.title,
                    // subtitle: post.node.subtitle,
                    createdTime: post.node.createdTime,
                    tags: post.node.tags,
                    category: post.node.category,
                    excerpt: mdxDocument.excerpt
                }
            } else {
                throw `Multiple relative MDX document found for post: "${post.slug}".`
            }
        });

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

module.exports = createPageOfHome;
