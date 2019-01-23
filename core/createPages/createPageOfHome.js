const path = require("path");

const IndexTemplate = path.resolve('src/templates/Index.js');

module.exports = async (arg) => {
    const { graphql, actions } = arg;

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
                filter: { fields: { documentType: {eq: "Post" } } }
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

    const getPageTitle = (index) => {
        if (index === 0) {
            return null
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
                pageTitle: getPageTitle(pageIndex),
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