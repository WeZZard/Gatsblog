const createNodeForTag = require('./createNodeForTag');

module.exports = async (args) => {
    const {
        actions,
        getNodesByType,
        createNodeId,
        createContentDigest,
        graphql,
    } = args;

    const { createNode } = actions;

    const {
        data: {
            allPost: {
                edges: posts,
            },
        },
    } = await graphql(`
        {
            allPost {
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

    return [...nonDuplicateTags].map(tag => createNodeForTag({
        tag: tag,
        getNodesByType: getNodesByType,
        createNode: createNode,
        createNodeId: createNodeId,
        createContentDigest: createContentDigest
    }));
};
