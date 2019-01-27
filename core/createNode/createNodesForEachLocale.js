const createNodeForLocale = require('./createNodeForLocale');

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
                        locale
                    }
                }
            }
        }
    `);

    const locales = (posts || [])
        .map(post => post.node.locale);

    const nonDuplicateLocales = new Set(locales);

    return [...nonDuplicateLocales].map(locale => createNodeForLocale({
        locale: locale,
        getNodesByType: getNodesByType,
        createNode: createNode,
        createNodeId: createNodeId,
        createContentDigest: createContentDigest
    }));
};
