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
                        category
                    }
                }
            }
        }
    `);

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
