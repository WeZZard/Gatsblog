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

    const nodeId = createNodeId(`page-${document.slug}`);
    const nodeData = Object.assign({}, document, {
        id: nodeId,
        parent: parent,
        children: [],
        internal: {
            type: `Page`,
            content: document.slug,
            contentDigest: createContentDigest(document.slug),
        },
    });

    debug(`Create page node: ${document}`);
    createNode(nodeData);

    createParentChildLink({parent: getNode(parent), child: getNode(nodeId)});

    return nodeId;
};
