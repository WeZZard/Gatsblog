const debug = require('debug');

module.exports = function (args) {
    const {
        parent,
        page,
        getNode,
        createNode,
        createNodeId,
        createContentDigest,
        createParentChildLink
    } = args;

    const nodeId = createNodeId(`page-${page.slug}`);
    const nodeData = Object.assign({}, page, {
        id: nodeId,
        parent: parent,
        children: [],
        internal: {
            type: `Page`,
            content: page.relativePath,
            contentDigest: createContentDigest(page.relativePath),
        },
    });

    debug(`Create page node: ${page}`);
    createNode(nodeData);

    createParentChildLink({parent: getNode(parent), child: getNode(nodeId)});

    return page;
};
