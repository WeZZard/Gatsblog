const _ = require('./createNodeForLocale');

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
                        locale
                    }
                }
            }
        }
    `);

    const locales = (posts || [])
        .map(post => post.node.locale);

    const nonDuplicateLocales = new Set(locales);

    return [...nonDuplicateLocales].map(locale => _({
        locale: locale,
        getNodesByType: getNodesByType,
        createNode: createNode,
        createNodeId: createNodeId,
        createContentDigest: createContentDigest
    }));
};
