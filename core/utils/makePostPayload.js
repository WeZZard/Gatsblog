const assert = require('assert');
const {
    filterTagsForPostNode,
    filterCategoryForPostNode
} = require('./filters');

module.exports = async (args) => {
    const {
        post,
        tags,
        categories,
        graphql,
        style,
    } = args;

    assert(style === 'Excerpt' || style === 'FullText');

    const primaryPostResult = await graphql(`
        {
            allPost(
                filter: {
                    documentIdentifier: {
                        eq: "${post.node.documentIdentifier}"
                    }
                }
            ) 
            {
                edges {
                    node {
                        isLocalized
                        tags
                        category
                    }
                }
            }
        }
    `);

    if (primaryPostResult.errors) {
        throw primaryPostResult.errors
    }

    const { data : { allPost: allPrimaryPost } } = primaryPostResult;

    const { edges : candidatePrimaryPosts } = allPrimaryPost || { edges : [] };

    let primaryPost;

    if (candidatePrimaryPosts.length === 0) {
        assert.fail(['Fatal error: no primary post found for post: ', post]);
    } else if (candidatePrimaryPosts.length === 1) {
        primaryPost = candidatePrimaryPosts[0];
    } else {
        primaryPost = candidatePrimaryPosts.filter(post => !post.node.isLocalized)[0];
        assert(primaryPost, ['No primary post (', primaryPost, ') found for post: ', post]);
    }

    const postTags = filterTagsForPostNode(primaryPost, tags);

    const postCategory = filterCategoryForPostNode(primaryPost, categories);

    switch (style) {
        case 'Excerpt':
            const excerptResult = await graphql(`
                {
                    allMdx( filter: {id: {eq: "${post.node.parent.id}" } } ) {
                        edges {
                            node {
                                excerpt(pruneLength: 140)
                            }
                        }
                    }
                }
            `);

            if (!excerptResult.data && excerptResult.errors) {
                throw excerptResult.errors
            }

            if (excerptResult.errors) {
                console.log('mdx excerpt query errors: ', excerptResult.errors);
            }

            const {
                data: {
                    allMdx: { edges: mdxExcerpts },
                },
            } = excerptResult;

            let mdxExcerpt;

            if (mdxExcerpts.length === 0) {
                throw `No relative MDX document found for post: "${post.node.slug}".`
            } else if (mdxExcerpts.length === 1) {
                mdxExcerpt = mdxExcerpts[0];
            } else {
                throw `Multiple relative MDX document were found for post: "${post.node.slug}".`
            }

            return {
                title: post.node.title,
                subtitle: post.node.subtitle,
                createdTime: post.node.createdTime,
                tags: postTags,
                category: postCategory,
                excerpt: mdxExcerpt.node.excerpt || "<i>The content is intentionally left blank.</i>",
                slug: post.node.slug,
            };
        case 'FullText':
            const mdxResult = await graphql(`
                {
                    allMdx( filter: {id: {eq: "${post.node.parent.id}" } } ) {
                        edges {
                            node {
                                code {
                                    body
                                    scope
                                }
                                tableOfContents
                            }
                        }
                    }
                }
            `);

            if (!mdxResult.data && mdxResult.errors) {
                throw mdxResult.errors
            }

            if (mdxResult.errors) {
                console.log('mdx full text query errors: ', mdxResult.errors);
            }

            const {
                data: {
                    allMdx: { edges: mdxDocuments },
                },
            } = mdxResult;

            let mdxDocument;

            if (mdxDocuments.length === 0) {
                throw `No relative MDX document found for post: "${post.node.slug}".`
            } else if (mdxDocuments.length === 1) {
                mdxDocument = mdxDocuments[0];
            } else {
                throw `Multiple relative MDX document were found for post: "${post.node.slug}".`
            }

            return {
                title: post.node.title,
                subtitle: post.node.subtitle,
                createdTime: post.node.createdTime,
                tags: postTags,
                category: postCategory,
                code: mdxDocument.node.code,
                tableOfContents: mdxDocument.node.tableOfContents,
            };
        default:
            throw `Unexpected style: ${style}`;
    }
};
