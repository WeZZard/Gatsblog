const debug = require('debug');

module.exports = function (args) {
    const {
        parent,
        page,
        relativePath,
        getNode,
        createNode,
        createNodeId,
        createContentDigest,
        createParentChildLink
    } = args;

    const nodeId = createNodeId(`page-${relativePath}`);
    const nodeData = Object.assign({}, page, {
        id: nodeId,
        parent: parent,
        children: [],
        internal: {
            type: `Page`,
            content: relativePath,
            contentDigest: createContentDigest(relativePath),
        },
    });

    debug(`Create page node: ${page}`);
    createNode(nodeData);

    createParentChildLink({parent: getNode(parent), child: getNode(nodeId)});

    return page;
};
