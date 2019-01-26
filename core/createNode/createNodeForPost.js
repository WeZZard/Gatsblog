const debug = require('debug');

module.exports = function (args) {
    const {
        parent,
        document,
        getNode,
        createNode,
        createNodeId,
        createContentDigest,
        createParentChildLink
    } = args;

    const nodeId = createNodeId(`post-${document.slug}`);
    const nodeData = Object.assign({}, document, {
        id: nodeId,
        parent: parent,
        children: [],
        internal: {
            type: `Post`,
            content: document.slug,
            contentDigest: createContentDigest(document.slug),
        },
    });

    debug(`Create post node: ${document}`);
    createNode(nodeData);

    createParentChildLink({parent: getNode(parent), child: getNode(nodeId)});

    return document;
};
