const debug = require('debug');

module.exports = function (args) {
    const {
        parent,
        post,
        relativePath,
        getNode,
        createNode,
        createNodeId,
        createContentDigest,
        createParentChildLink
    } = args;

    const nodeId = createNodeId(`post-${relativePath}`);
    const nodeData = Object.assign({}, post, {
        id: nodeId,
        parent: parent,
        children: [],
        internal: {
            type: `Post`,
            content: relativePath,
            contentDigest: createContentDigest(relativePath),
        },
    });

    debug(`Create post node: ${post}`);
    createNode(nodeData);

    createParentChildLink({parent: getNode(parent), child: getNode(nodeId)});

    return post;
};
