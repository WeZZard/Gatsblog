const debug = require('debug');

module.exports = function (args) {
    const {
        parent,
        post,
        createNode,
        createNodeId,
        createContentDigest
    } = args;

    const nodeId = createNodeId(`post-${post.slug}`);
    const nodeData = Object.assign({}, post, {
        id: nodeId,
        parent: parent,
        children: [],
        internal: {
            type: `Post`,
            content: post.slug,
            contentDigest: createContentDigest(post.slug),
        },
    });

    debug(`Create post node: ${post}`);
    createNode(nodeData);

    return nodeId;
};
