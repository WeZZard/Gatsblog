const _ = require('./createNodeForCategory');

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
                        category
                    }
                }
            }
        }
    `);

    const categories = (posts || [])
        .map(post => post.node.category);

    const nonDuplicateCategories = new Set(categories);

    return [...nonDuplicateCategories].map(category => _({
        category: category,
        getNodesByType: getNodesByType,
        createNode: createNode,
        createNodeId: createNodeId,
        createContentDigest: createContentDigest
    }));
};
