const _ = require('./createNodeForTag');

module.exports = async (args) => {
    const {
        actions,
        getNodesByType,
        createNodeId,
        createContentDigest,
        graphql,
    } = args;

    const { createNode } = actions;

    const isPreviewEnabled = process.env.GATSBY_IS_PREVIEW_ENABLED || false;

    const filter = isPreviewEnabled ? "" : "(filter: {isPublished: {eq: true}})";

    const {
        data: {
            allPost: {
                edges: posts,
            },
        },
    } = await graphql(`
        {
            allPost${filter} {
                edges {
                    node {
                        tags
                    }
                }
            }
        }
    `);

    const tags = (posts || [])
        .map(post => post.node.tags)
        .flatMap(_ => _);

    const nonDuplicateTags = new Set(tags);

    return [...nonDuplicateTags].map(tag => _({
        tag: tag,
        getNodesByType: getNodesByType,
        createNode: createNode,
        createNodeId: createNodeId,
        createContentDigest: createContentDigest
    }));
};
