const createNodeForCategory = require('./create-node-for-category');

module.exports = async (args) => {
    const {
        actions,
        getNodesByType,
        createNodeId,
        createContentDigest,
        graphql,
    } = args;

    const { createNode } = actions;

    const result = await graphql(`
        {
            allPost {
                edges {
                    node {
                        category
                    }
                }
            }
        }
    `);

    if (result.errors) {
        return [];
    }

    const {
        data: {
            allPost: {
                edges: posts,
            },
        },
    } = result;

    const categories = (posts || [])
        .map(post => post.node.category);

    const nonDuplicateCategories = new Set(categories);

    return [...nonDuplicateCategories].map(category => createNodeForCategory({
        category: category,
        getNodesByType: getNodesByType,
        createNode: createNode,
        createNodeId: createNodeId,
        createContentDigest: createContentDigest
    }));
};
