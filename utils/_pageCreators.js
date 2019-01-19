const { graphql } = require('gatsby');

const _createPageForPosts = async (graphql, actions) => {
    {
        template, (dateFormat = 'MMM D, YYYY')
    }

    const { createPage } = actions;
    const {
        data: {
            allMarkdownRemark: { edges: posts },
        },
    } = await graphql(
        `
            query($dateFormat: String!) {
                allMarkdownRemark(
                    filter: {
                        fields: {
                            path: {
                                regex: "//([0-9]{4})/([0-9]{2})/([0-9]{2})//"
                            }
                        }
                    }
                    sort: { fields: [fields___date], order: DESC }
                ) {
                    edges {
                        node {
                            fields {
                                date(formatString: $dateFormat)
                                path
                            }
                            frontmatter {
                                siteOwner
                                title
                            }
                        }
                    }
                }
            }
        `,
        { dateFormat }
    );

    posts.forEach(({ node: { fields: { path } } }, index) => {
        // Determine prev and next blog posts.
        // If none exists, set to null.
        let prev = index === posts.length - 1 ? null : posts[index + 1];
        if (prev) {
            const {
                node: {
                    fields: { path: prevPath, date },
                    frontmatter: { title },
                },
            } = prev;
            prev = { date, path: prevPath, title }
        }
        let next = index === 0 ? null : posts[index - 1];
        if (next) {
            const {
                node: {
                    fields: { path: nextPath, date },
                    frontmatter: { title },
                },
            } = next;
            next = { date, path: nextPath, title }
        }
        // Template uses `path` to query page data.
        createPage({
            path,
            component: template,
            context: {
                prev,
                next,
            },
        })
    })
};

const _createPageForCategories = async (graphql, actions) => {};

const _createPageForTagIndex = async (graphql, actions) => {};

const _createPageForTags = async (graphql, actions) => {
    const { createPage } = actions;
    const {
        data: {
            allMarkdownRemark: { edges: posts },
        },
    } = await graphql(`
        {
            allMarkdownRemark(
                filter: {
                    fields: {
                        path: { regex: "//([0-9]{4})/([0-9]{2})/([0-9]{2})//" }
                    }
                }
                sort: { fields: [fields___date], order: DESC }
            ) {
                edges {
                    node {
                        fields {
                            date(formatString: "D MMM YYYY")
                            path
                        }
                        frontmatter {
                            siteOwner
                            title
                            tags
                            category
                        }
                    }
                }
            }
        }
    `);

    // For each tag create an array with posts that were tagged with this tag.
    const postsByTags = {};

    posts.forEach(
        ({
            node: {
                fields: { date, path },
                frontmatter: { siteOwner, tags, title },
            },
        }) => {
            if (tags) {
                tags.forEach(tag => {
                    if (!postsByTags[tag]) {
                        postsByTags[tag] = []
                    }
                    postsByTags[tag].push({
                        siteOwner,
                        date,
                        path,
                        title,
                    })
                })
            }
        }
    );

    // Create tag pages.
    const tags = Object.keys(postsByTags);
    tags.forEach(tag => {
        const postsByTag = postsByTags[tag];
        createPage({
            path: `/tags/${tag}`,
            component: template,
            context: {
                posts: postsByTag,
                tag,
            },
        })
    })
};

module.exports = [
    _createPageForPosts,
    _createPageForCategories,
    _createPageForTagIndex,
    _createPageForTags,
];
