const debug = require('debug');

module.exports = function (args) {
    const {
        parent,
        post,
        nodeIdBase,
        nodeContent,
        getNode,
        createNode,
        createNodeId,
        createContentDigest,
        createParentChildLink
    } = args;

    const nodeId = createNodeId(`post-${nodeIdBase}`);
    const nodeData = Object.assign({}, post, {
        id: nodeId,
        parent: parent,
        children: [],
        internal: {
            type: `Post`,
            content: nodeContent,
            contentDigest: createContentDigest(nodeContent),
        },
    });

    debug(`Create post node: ${post}`);
    createNode(nodeData);

    createParentChildLink({parent: getNode(parent), child: getNode(nodeId)});

    return post;
};
