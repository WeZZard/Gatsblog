const debug = require('debug');

module.exports = function (args) {
    const {
        parent,
        page,
        nodeIdBase,
        nodeContent,
        getNode,
        createNode,
        createNodeId,
        createContentDigest,
        createParentChildLink
    } = args;

    const nodeId = createNodeId(`page-${nodeIdBase}`);
    const nodeData = Object.assign({}, page, {
        id: nodeId,
        parent: parent,
        children: [],
        internal: {
            type: `Page`,
            content: nodeContent,
            contentDigest: createContentDigest(nodeContent),
        },
    });

    debug(`Create page node: ${page}`);
    createNode(nodeData);

    createParentChildLink({parent: getNode(parent), child: getNode(nodeId)});

    return page;
};
