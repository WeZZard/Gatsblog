const assert = require('assert');
const {
    filterTagsForPostNode,
    filterCategoryForPostNode
} = require('./utils');

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

    const mdxResult = await graphql(`
        {
            allMdx( filter: {id: {eq: "${post.node.parent.id}" } } ) {
                edges {
                    node {
                        excerpt(pruneLength: 300)
                        html
                        code {
                            body
                            scope
                        }
                    }
                }
            }
        }
    `);

    if (!mdxResult.data && mdxResult.errors) {
        throw mdxResult.errors
    }

    const {
        data: {
            allMdx: { edges: mdxDocuments },
        },
    } = mdxResult;

    if (mdxDocuments.length === 0) {
        throw `No relative MDX document found for post: "${post.node.slug}".`
    } else if (mdxDocuments.length === 1) {
        const mdxDocument = mdxDocuments[0];
        switch (style) {
            case 'Excerpt':
                return {
                    title: post.node.title,
                    subtitle: post.node.subtitle,
                    createdTime: post.node.createdTime,
                    tags: postTags,
                    category: postCategory,
                    excerpt: mdxDocument.node.excerpt || "<i>The content is intentionally left blank.</i>",
                    slug: post.node.slug,
                };
            case 'FullText':
                return {
                    title: post.node.title,
                    subtitle: post.node.subtitle,
                    createdTime: post.node.createdTime,
                    tags: postTags,
                    category: postCategory,
                    html: mdxDocument.html,
                    code: mdxDocument.code,
                    slug: post.node.slug,
                };
            default:
                throw `Unexpected style: ${style}`;
        }
    } else {
        throw `Multiple relative MDX document were found for post: "${post.node.slug}".`
    }
};
