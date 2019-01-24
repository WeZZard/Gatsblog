const makeCategoryPayloadByNodeID = require('./makeCategoryPayloadByNodeID');
const makeTagPayloadByNodeID = require('./makeTagPayloadByNodeID');

    module.exports = async (post, graphql) => {
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

    const tags = await Promise.all(post.node.tags.map(async (tag) => makeTagPayloadByNodeID(tag, graphql)));
    const category = await makeCategoryPayloadByNodeID(post.node.category, graphql);

    if (mdxDocuments.length === 0) {
        throw `No relative MDX document found for post: "${post.node.slug}".`
    } else if (mdxDocuments.length === 1) {
        const mdxDocument = mdxDocuments[0];
        return {
            title: post.node.title,
            // subtitle: post.node.subtitle,
            createdTime: post.node.createdTime,
            tags: tags,
            category: category,
            excerpt: mdxDocument.node.excerpt || "<i>The content is intentionally left blank.</i>",
            slug: post.node.slug,
        }
    } else {
        throw `Multiple relative MDX document found for post: "${post.node.slug}".`
    }
};