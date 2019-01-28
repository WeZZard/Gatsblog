const {
    filterTagsForPostNode,
    filterCategoryForPostNode
} = require('./utils');

module.exports = async (args) => {
    const { post, tags, categories, graphql } = args;

    const {
        data: {
            allMdx: { edges: mdxDocuments },
        },
    } = await graphql(`
        {
            allMdx( filter: {id: {eq: "${post.node.parent.id}" } } ) {
                edges {
                    node {
                        excerpt(pruneLength: 300)
                    }
                }
            }
        }
    `);

    const postTags = filterTagsForPostNode(post, tags);
    const postCategory = filterCategoryForPostNode(post, categories);

    if (mdxDocuments.length === 0) {
        throw `No relative MDX document found for post: "${post.node.slug}".`
    } else if (mdxDocuments.length === 1) {
        const mdxDocument = mdxDocuments[0];
        return {
            title: post.node.title,
            subtitle: post.node.subtitle,
            createdTime: post.node.createdTime,
            tags: postTags,
            category: postCategory,
            excerpt: mdxDocument.node.excerpt || "<i>The content is intentionally left blank.</i>",
            slug: post.node.slug,
        }
    } else {
        throw `Multiple relative MDX document were found for post: "${post.node.slug}".`
    }
};
